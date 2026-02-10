const Wotd = require("../models/wotd.model");



// creates a WOTD entry
module.exports.add = (req, res) => {
    Wotd.findOne({ word: req.body.word })
        .then(word => {
            if (word === null) {
                Wotd.create(req.body)
                    .then(wotdNew => {
                        res.json({
                            msg: "WOTD saved successfully!",
                            Wotd: {
                                _id: wotdNew._id,
                                word: wotdNew.word,
                                def: wotdNew.def,
                            }
                        });
                    })
                    .catch(err => res.status(400).json(err));
            } else {
                res.status(400).json({
                    msg: "WOTD already exists!",
                });
            }
        })
        .catch(err => res.status(400).json(err));
};


// retrieves newest WOTD (always 200 so client never sees 400/500)
module.exports.latest = (req, res) => {
    Wotd.findOne({}).sort({ _id: -1 }).limit(1)
        .then(wotd => res.status(200).json({
            msg: "WOTD retrieved successfully!",
            Wotd: wotd ? { _id: wotd._id, word: wotd.word, def: wotd.def } : { _id: null, word: "", def: "" },
        }))
        .catch(err => {
            console.error("WOTD latest error:", err.message);
            if (!res.headersSent) res.status(200).json({ msg: "WOTD unavailable", Wotd: { _id: null, word: "", def: "" } });
        });
};


// retrieves archive of WOTD (always 200 so client never sees 400/500)
module.exports.archive = (req, res) => {
    Wotd.find({}).sort({ _id: -1 }).limit(31)
        .then(archive => res.status(200).json({
            msg: "Archive retrieved successfully!",
            Archive: Array.isArray(archive) ? archive : [],
        }))
        .catch(err => {
            console.error("WOTD archive error:", err.message);
            if (!res.headersSent) res.status(200).json({ msg: "Archive unavailable", Archive: [] });
        });
};
