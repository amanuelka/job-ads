const Ad = require('../models/Ad');
const User = require('../models/User');

async function getAll() {
    return Ad.find({}).limit(3).lean();
};

async function getOwn(search) {
    if (search){
        const owner = await User.findOne({ email: { $regex: search, $options: 'i' } }).lean();
        return await Ad.find({ owner: owner._id }).lean();
    }
}

async function getById(id) {
    return Ad.findById(id).lean();
};

async function getByIdPopulated(id) {
    return Ad.findById(id).populate('owner').populate('users').lean();
};

async function create(data) {
    return Ad.create(data);
};

async function update(id, data) {
    const existing = await Ad.findById(id);
    Object.assign(existing, data);
    return existing.save();
};

async function deleteByid(id) {
    return Ad.findByIdAndDelete(id);
};

async function apply(adId, userId) {
    const ad = await Ad.findById(adId);
    ad.users.push(userId);
    return ad.save();
};

module.exports = { getAll, getById, create, update, deleteByid, apply, getByIdPopulated, getOwn };