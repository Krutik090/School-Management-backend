const mongoose = require('mongoose');
const argon2 = require('argon2');
// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin'],
        required: true,
    },  
    profileImage: {
        type: String,
        default: '', // Stores the filename of the uploaded image
    },
}, { timestamps: true }); // Adds createdAt & updatedAt fields


// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        return false;
    }
};
const User = mongoose.model('User', UserSchema);

module.exports = { User };