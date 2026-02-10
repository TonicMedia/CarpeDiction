const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');



// defines the model for Users
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "*Username is required!"],
        minlength: [2, "*Username must be at least 2 characters long!"],
        maxlength: [16, "*Username must no more than 16 characters long!"],
        validate: [
            {
                validator: val => !(/\s/g.test(val)),
                message: '*Username must not contain spaces!'
            },
            {
                validator: val => !(/DELETED/g.test(val)),
                message: '*Username is prohibited!'
            },
            {
                validator: val => !(/deleted/g.test(val)),
                message: '*Username is prohibited!'
            },
            {
                validator: val => !(/Deleted/g.test(val)),
                message: '*Username is prohibited!'
            }
        ]
    },
    userNameLower: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "*Email is required!"],
        validate: {
            validator: val => /^([\w.-]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "*Please enter a valid email"
        }
    },
    emailLower: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "*Password is required!"],
        minlength: [8, "*Password must be at least 8 characters long!"],
        maxlength: [72, "*Password must be no more than 72 characters long!"]
    },
    favs: {
        type: [String],
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
}, { timestamps: true });


// adds and sets passwordConf as "virtual field" for validation that won't be saved to db
UserSchema.virtual('passwordConf')
    .get(() => this._passwordConf)
    .set(value => this._passwordConf = value);


// pre hook checks the userName and the two passwords before saving User data
// do NOT rewrite callback as arrow func or it will not have the right scope for "this"
UserSchema.pre('validate', function (next) {
    if (!(/^\$2[ayb]\$.{56}$/gm.test(this.password)) && this.password !== this.passwordConf)
        this.invalidate('passwordConf', '*Password and Password Confirmation must match!');
    if (/\s/g.test(this.password) || /\s/g.test(this.passwordConf))
        this.invalidate('passwordConf', '*Password must not contain spaces!');
    next();
});


// pre hook checks if the password is new, if so it hashes it before saving User data
// do NOT rewrite this one as arrow either!
UserSchema.pre('save', function (next) {
    this.emailLower = this.email.toLowerCase();
    this.userNameLower = this.userName.toLowerCase();
    if (!(/^\$2[ayb]\$.{56}$/gm.test(this.password))) {
        bcrypt.hash(this.password, 12)
            .then(hash => {
                this.password = hash;
                next();
            });
    } else {
        next();
    }
});


// generates a mongoose model to export for UserSchema
const User = mongoose.model("User", UserSchema);

module.exports = User;
