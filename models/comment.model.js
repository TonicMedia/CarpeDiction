const mongoose = require('mongoose');



// defines the schema for Comments
const CommentSchema = new mongoose.Schema({
    query: {
        type: String,
    },
    content: {
        type: String,
        required: [true, "*You can't post what hasn't been written!"],
        minlength: [50, "*Your comment is too short, write something insightful!"],
        maxlength: [601, "*Comments must no longer than 600 characters!"],
        validate: {
            validator: val => (val.replace(/\s/g, '').length > 50 && val.split(" ").length > 8),
            message: "*Your comment is too short! Write something that will contribute to the discussion!"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    creator: {
        type: String,
    },
    likers: {
        type: [String],
    },
}, { timestamps: true });


// generates a mongoose model to export for UserSchema
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
