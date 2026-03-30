const mongoose = require('mongoose');
const bcrypt = requrie('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'productManager', 'superAdmin'], default: 'customer' },
    profile: {
        firstName: String,
        lastName: String,
        phone: String
    },
    addresses: [{
        street: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        isDefault: Boolean
    }]
}, { timestamps: true});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);