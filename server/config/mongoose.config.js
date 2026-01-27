const mongoose = require('mongoose'),
    uri = `${process.env.CD_DB_URL}`;



// configures the Mongoose connection to the MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));
