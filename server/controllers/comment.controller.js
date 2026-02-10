const Comment = require("../models/comment.model");



// posts a new comment
module.exports.post = (req, res) => {
    Comment.create(req.body)
        .then(comment => {
            res.json({
                msg: "Comment posted successfully!",
                comment: {
                    _id: comment._id,
                    query: comment.query,
                    content: comment.content,
                    user: comment.user,
                    creator: comment.creator,
                },
            });
        })
        .catch(err => res.status(400).json(err));
};


// retrieves all comments for the query (always 200 so client never sees 400/500)
module.exports.retrieve = (req, res) => {
    const sendEmpty = () => res.status(200).json({ msg: "Comments retrieved successfully!", comments: [] });
    Comment.find({ query: req.params.query }).sort({ _id: -1 }).populate('user')
        .then(comments => res.status(200).json({
            msg: "Comments retrieved successfully!",
            comments: Array.isArray(comments) ? comments : [],
        }))
        .catch(err => {
            console.error("Comments retrieve error:", err.message);
            if (!res.headersSent) sendEmpty();
        });
};


// retrieves the top 3 comments for the query (always 200 so client never sees 400/500)
module.exports.getTops = (req, res) => {
    const sendEmpty = () => res.status(200).json({ msg: "Top comments retrieved successfully!", comments: [] });
    Comment.find({ query: req.params.query }).sort({ likers: -1 }).limit(3).sort({ _id: -1 }).populate('user')
        .then(comments => res.status(200).json({
            msg: "Top comments retrieved successfully!",
            comments: Array.isArray(comments) ? comments : [],
        }))
        .catch(err => {
            console.error("Comments getTops error:", err.message);
            if (!res.headersSent) sendEmpty();
        });
};


// updates one comment via their ID
module.exports.likeComment = (req, res) => {
    Comment.findById(req.body._id)
        .then(commentToUpdate => {
            // updates likers if comment is being liked/unliked
            if (req.body.likers)
                commentToUpdate.likers = req.body.likers;
            // saves the changes to the updated comment
            commentToUpdate.save()
                .then(updatedComment => {
                    res.json({
                        msg: "Comment updated successfully!",
                        user: {
                            _id: updatedComment._id,
                            query: updatedComment.query,
                            creator: updatedComment.creator,
                            content: updatedComment.content,
                            likers: updatedComment.likers,
                        }
                    })
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
};


// deletes the comment via it's ID
module.exports.deleteComment = (req, res) => {
    Comment.deleteOne({ _id: req.params.id })
        .then(deleteConfirmation => res.json(deleteConfirmation))
        .catch(err => res.status(400).json(err));
};
