const { Schema, model, Types } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/i;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, match: [EMAIL_PATTERN, 'Invalid email'] },
    hashedPassword: { type: String, required: true },
    description: { type: String, required: true, maxlength: [40, 'Email must be at least 3 characters long'] },
    ads: { type: [Types.ObjectId], ref: 'User' }
});

userSchema.index({ email: 1, }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;