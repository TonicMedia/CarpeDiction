const mongoose = require('mongoose'),
    rawUri = process.env.CD_DB_URL;

if (!rawUri) {
    console.warn("CD_DB_URL is not set; database features will fail.");
}

// Encodes user and password in the URI so special characters (e.g. @) don't cause "Unescaped at-sign"
function encodeMongoUri(uri) {
    if (!uri || typeof uri !== "string") return uri;
    const match = uri.match(/^(mongodb(\+srv)?:\/\/)([^/]+)(\/.*)?$/);
    if (!match) return uri;
    const [, protocol, , authority, path = ""] = match;
    const atIdx = authority.lastIndexOf("@");
    if (atIdx === -1) return uri;
    const userPass = authority.slice(0, atIdx);
    const hostPart = authority.slice(atIdx + 1);
    const colonIdx = userPass.indexOf(":");
    if (colonIdx === -1) return uri;
    const user = userPass.slice(0, colonIdx);
    const password = userPass.slice(colonIdx + 1);
    const encoded = encodeURIComponent(user) + ":" + encodeURIComponent(password) + "@" + hostPart;
    return protocol + encoded + path;
}

const uri = encodeMongoUri(rawUri) || "mongodb://localhost:27017/carpediction";

// configures the Mongoose connection to the MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => {
        console.error("Something went wrong when connecting to the database:", err.message);
        if (err.message && err.message.includes("querySrv ECONNREFUSED")) {
            console.error("Tip: If using MongoDB Atlas, try the 'Standard connection string' (not SRV) in Atlas Connect dialog, or check network/firewall and Atlas IP access list.");
        }
    });
