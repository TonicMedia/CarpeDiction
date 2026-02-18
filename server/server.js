// Suppress DEP0169 url.parse() deprecation from dependencies (e.g. MongoDB driver)
const origEmitWarning = process.emitWarning;
process.emitWarning = function (warning, typeOrOpts, code, ...rest) {
    const codeStr = typeof code === 'string' ? code : (typeOrOpts && typeOrOpts.code);
    if (codeStr === 'DEP0169') return;
    const msg = String(typeof warning === 'string' ? warning : (warning && warning.message) || '');
    if (msg.includes('DEP0169') || msg.includes('url.parse()')) return;
    return origEmitWarning.apply(process, [warning, typeOrOpts, code, ...rest]);
};

// configures axios and imports cheerio parser for WOTD retrieval
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

// configures dotenv and mongoose
require('dotenv').config();
const { dbReady } = require('./config/mongoose.config');


// configures and initializes an express server
const express = require('express'),
    app = express(),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    port = process.env.PORT;

// Trust first proxy so req.ip reflects X-Forwarded-For (client IP) when behind a load balancer
app.set('trust proxy', 1);

// configures and registers middleware
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:3000',
    'https://www.carpediction.com',
    'https://carpediction-server-and-client.onrender.com',
];
app.use(cors({
    credentials: true,
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
    },
}));
// Set a minimal Permissions-Policy with only standard features to avoid console errors from experimental/unrecognized directives (e.g. browsing-topics, run-ad-auction) that some hosts inject
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    next();
});
console.log(`Server Type: ${process.env.NODE_ENV}`)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Block common bots and crawlers in production (User-Agent–based)
const BOT_UA_PATTERNS = [
    /bot/i, /crawl/i, /spider/i, /slurp/i, /scrapy/i, /curl/i, /wget/i,
    /python-requests/i, /python\/3/i, /java\//i, /go-http/i, /axios/i,
    /^node\s/i, /headless/i, /phantom/i, /selenium/i, /puppeteer/i,
    /googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i, /baiduspider/i,
    /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i, /slackbot/i,
    /applebot/i, /petalbot/i, /ahrefsbot/i, /semrushbot/i, /dotbot/i,
];
function isLikelyBot(req) {
    const ua = req.get('user-agent') || '';
    if (!ua.trim()) return true; // no UA often indicates scripts/bots
    return BOT_UA_PATTERNS.some(pat => pat.test(ua));
}
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && isLikelyBot(req)) {
        res.status(403).send('Forbidden');
        return;
    }
    next();
});

// Safely log all HTTP requests (no auth headers, cookies, or body)
const SENSITIVE_QUERY_KEYS = ['token', 'key', 'secret', 'password', 'auth', 'cookie'];
function safePath(url) {
    if (!url || typeof url !== 'string') return url;
    const [pathPart, qs] = url.split('?');
    if (!qs) return pathPart;
    const params = new URLSearchParams(qs);
    SENSITIVE_QUERY_KEYS.forEach(k => {
        if (params.has(k)) params.set(k, '[REDACTED]');
    });
    const redacted = params.toString();
    return redacted ? `${pathPart}?${redacted}` : pathPart;
}
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const pathSafe = safePath(req.originalUrl || req.url);
        const ip = req.ip || req.socket?.remoteAddress || '-';
        const forwarded = req.get('x-forwarded-for');
        // Leftmost in X-Forwarded-For is the client; rightmost is the last proxy (what req.ip is with trust proxy)
        const clientIp = forwarded ? forwarded.split(',')[0].trim() : ip;
        const referer = req.get('referer') || req.get('referrer') || '-';
        const ua = req.get('user-agent');
        const uaShort = ua ? (ua.length > 80 ? ua.slice(0, 77) + '...' : ua) : '-';
        console.log(`[${new Date().toISOString()}] ${req.method} ${pathSafe} ${res.statusCode} ${ms}ms client=${clientIp} referer=${referer} ua=${uaShort}`);
        const p = (req.originalUrl || req.url).split('?')[0];
        if (req.method === 'GET' && (p.startsWith('/api/comments/retrieve/') || p.startsWith('/api/comments/tops/'))) {
            const query = decodeURIComponent(p.replace(/^\/api\/comments\/(?:retrieve|tops)\//, '') || '').trim();
            if (query) console.log(`  -> Search query: "${query}"`);
        }
    });
    next();
});

// imports routes to express app
require('./routes/user.routes')(app);
require('./routes/wotd.routes')(app);
require('./routes/comment.routes')(app);


// serve static assets in production (React build) — must be after API routes
if (process.env.NODE_ENV === 'production') {
    // Reject HEAD for page routes to stop link-checker/crawler traffic (real users use GET)
    const staticPathPrefixes = ['/static/', '/images/', '/fonts/'];
    app.use((req, res, next) => {
        if (req.method !== 'HEAD') return next();
        const p = (req.path || req.url || '').split('?')[0];
        if (p.startsWith('/api/')) return next();
        if (staticPathPrefixes.some(prefix => p.startsWith(prefix)) || p === '/favicon.ico' || p === '/manifest.json') return next();
        res.status(405).set('Allow', 'GET').send('Method Not Allowed');
    });
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}


// Start listening only after DB is connected (avoids "buffering timed out" on register/login)
dbReady
    .then(() => {
        const server = app.listen(port, () => {
            const addr = server.address();
            const bound = addr ? `${addr.address}:${addr.port}` : `port ${port}`;
            console.log(`Listening on ${bound}`);
            const url = process.env.API_ROOT || (addr && (addr.address === '0.0.0.0' || addr.address === '::') ? `http://localhost:${addr.port}` : `http://${bound}`);
            console.log(`URL: ${url}`);
            // Scrape WOTD once on startup, then every hour
            getWotd();
            setInterval(getWotd, 3600000);
        });
    })
    .catch(() => {
        console.error("Server not started: database connection failed.");
        process.exit(1);
    });


// Scrapes WOTD and saves to the db (used on startup and on interval)
function getWotd() {
    const Wotd = {};
    const extUrl = 'https://www.merriam-webster.com/word-of-the-day';
    console.log(`[external API] GET ${extUrl}`);
    axios.get(extUrl)
        .then(res => {
            console.log(`[external API] GET ${extUrl} ${res.status}`);
            const html = res.data;
            const $ = cheerio.load(html);
            // First h1 is "Word of the Day"; the actual word is in the first h2
            Wotd.word = $("h2").first().text().trim() || $("h1:first").text().trim();
            Wotd.def = "";
            // Start of today UTC so add/latest use one WOTD per day
            const now = new Date();
            Wotd.date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            console.log(Wotd);
            axios.post(`${process.env.API_ROOT}/api/wotd/add`, Wotd)
                .then(res => console.log(res.data))
                .catch(err => {
                    const alreadyExists = err.response?.status === 400 &&
                        (err.response?.data?.msg === 'WOTD already exists!' || err.response?.data?.msg === 'WOTD for this date already in DB, skipping.');
                    if (alreadyExists) {
                        console.log(`WOTD "${Wotd.word}" for today already in DB, skipping.`);
                    } else {
                        console.error('WOTD add failed:', err.message, err.response?.data || '');
                    }
                });
        })
        .catch(err => {
            console.log(`[external API] GET ${extUrl} error:`, err.message || err.code || err);
        });
}
