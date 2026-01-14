const mongoose = require('mongoose');

// Validate that the database URL is set
if (!process.env.CD_DB_URL) {
    console.error("Error: CD_DB_URL environment variable is not set");
    process.exit(1);
}

const uri = process.env.CD_DB_URL.trim();

// Validate that the URI is not empty after trimming
if (!uri) {
    console.error("Error: CD_DB_URL environment variable is empty");
    process.exit(1);
}

// Validate that the URI has a valid MongoDB connection string format
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error("Error: CD_DB_URL must start with 'mongodb://' or 'mongodb+srv://'");
    console.error("Current value (first 20 chars):", uri.substring(0, 20));
    process.exit(1);
}

// configures the Mongoose connection to the MongoDB
// Note: useNewUrlParser and useUnifiedTopology are default in Mongoose 7+
mongoose.connect(uri)
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));