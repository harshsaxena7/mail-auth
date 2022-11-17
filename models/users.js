const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
   
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User',
        required: 'Role is required'
    }

},

    { timestamps: true })
userSchema.pre('save',async function(next){
    try{
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }
    catch(error){
        next(error)
    }
})

module.exports = mongoose.model('User', userSchema);
