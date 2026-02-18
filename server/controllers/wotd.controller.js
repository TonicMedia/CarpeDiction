const Wotd = require("../models/wotd.model");

// start of today UTC (for one WOTD per day)
function todayUTC() {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// creates or updates a WOTD entry for the given date (one per day)
module.exports.add = (req, res) => {
    const date = req.body.date ? new Date(req.body.date) : todayUTC();
    const dayStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    Wotd.findOne({ date: dayStart })
        .then(existing => {
            if (existing) {
                return res.status(400).json({
                    msg: "WOTD for this date already in DB, skipping.",
                });
            }
            const payload = { word: req.body.word, def: req.body.def || "", date: dayStart };
            return Wotd.create(payload)
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
        })
        .catch(err => res.status(400).json(err));
};


// retrieves WOTD for the most recent date (today if scraped, else latest we have)
module.exports.latest = (req, res) => {
    Wotd.findOne({}).sort({ date: -1, _id: -1 }).limit(1)
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
    Wotd.find({}).sort({ date: -1, _id: -1 }).limit(31)
        .then(archive => res.status(200).json({
            msg: "Archive retrieved successfully!",
            Archive: Array.isArray(archive) ? archive : [],
        }))
        .catch(err => {
            console.error("WOTD archive error:", err.message);
            if (!res.headersSent) res.status(200).json({ msg: "Archive unavailable", Archive: [] });
        });
};
