const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    quantity: {
        type: Number,
        required: true,
    },
    units: {
        type: String,
        required: true,
        enum: ['kg','gms','lit','ml','dozen','units']
    },
    stockcount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
    },
    notify: {
        type: String,
        required: true,
        enum: ['auto','request']
    },
    utilizationTime: {
        type: Number
    },
    utilizationQuantity: {
        type: Number
    },
    utilizationUnits: {
        type: String,
        enum: ['kg','gms','lit','ml','dozen','units']
    },
    description: {
        type: String
    },
    nextreqdate: {
        type: String
    },
    totalstock: {
        amount: {
            type: Number
        },
        units: {
            type: String,
            enum: ['gms','ml','dozen','units']
        },
        daysleft: {
            type: Number
        }
    },
    reminder: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
})

const Item = new mongoose.model('Item',itemSchema)
module.exports = Item