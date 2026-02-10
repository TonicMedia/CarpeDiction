// Suppress DEP0169 url.parse() deprecation from dependencies (e.g. MongoDB driver)
const origEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
    const msg = typeof warning === 'string' ? warning : (warning && warning.message) || '';
    if (msg.includes('DEP0169') || msg.includes('url.parse()')) return;
    return origEmitWarning.apply(process, [warning, ...args]);
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


// configuers and registers middleware
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
        console.log(`[${new Date().toISOString()}] ${req.method} ${pathSafe} ${res.statusCode} ${ms}ms ${ip}`);
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
    axios.get('https://www.merriam-webster.com/word-of-the-day')
        .then(res => {
            const html = res.data;
            const $ = cheerio.load(html);
            // First h1 is "Word of the Day"; the actual word is in the first h2
            Wotd.word = $("h2").first().text().trim() || $("h1:first").text().trim();
            Wotd.def = "";
            console.log(Wotd);
            axios.post(`${process.env.API_ROOT}/api/wotd/add`, Wotd)
                .then(res => console.log(res.data))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}
