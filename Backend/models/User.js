const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
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
        enum: ['user', 'admin']
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Adrress"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function (enteredPass) {
    return await bcrypt.compare(enteredPass, this.password)
}


//Export the model
module.exports = mongoose.model('User', userSchema);