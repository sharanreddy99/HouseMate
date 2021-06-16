const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        lowercase: true
    },
    lname: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default : ''
    }
})

userSchema.virtual('items',{
    ref: 'Item',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.HOUSEMATE_NODE_SECRETJWT,{expiresIn: '5d'});

    user.token = token
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid Credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid Credentials')
    }

    return user
}

userSchema.pre('save',async function(next) {

    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8) 
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User