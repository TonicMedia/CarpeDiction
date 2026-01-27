const mongoose = require('mongoose');



// defines the model for WOTDs
const WotdSchema = new mongoose.Schema({
    word: {
        type: String,
        required: [true, "No word found!"],
    },
    def: {
        type: String,
        required: false,
    }
}, { timestamps: true });


// generates a mongoose model to export for WotdSchema
const Wotd = mongoose.model("Wotd", WotdSchema);

module.exports = Wotd;
