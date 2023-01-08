const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
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
        default: "user"
    },
    active: {
        type: String,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);

    // Store hash in your password DB.
    this.password = await bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);