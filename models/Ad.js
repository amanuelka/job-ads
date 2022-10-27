const { Schema, model, Types } = require('mongoose');

const adSchema = new Schema({
    headline: { type: String, required: true, minlength: [4, 'Headline must be at least 4 characters long'] },
    location: { type: String, required: true, minlength: [8, 'Location must be at least 8 characters long'] },
    company: { type: String, required: true, minlength: [3, 'Company name must be at least 3 characters long'] },
    description: { type: String, required: true, maxlength: [40, 'Description cannot be longer than 40 characters'] },
    owner: { type: Types.ObjectId, ref: 'User' },
    users: { type: [Types.ObjectId], ref: 'User', default: [] }
});

const Ad = model('Ad', adSchema);
module.exports = Ad;