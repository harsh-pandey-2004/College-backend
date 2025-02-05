const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    city: String,
    password: String,
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User-college', UserSchema);
