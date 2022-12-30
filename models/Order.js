const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    collectionId: {
        type: String,
        require: true
    },
    tokenId: {
        type: String,
        require: true
    },
    hash: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    maker: {
        type: String,
        require: true
    },
    taker: {
        type: String,
    },
    make: {
        type: Schema.Types.Mixed
    },
    take: {
        type: Schema.Types.Mixed
    },
    fill: {
        type: String,
        require: true
    },
    fillValue: {
        type: String,
        require: true
    },
    start: {
        type: Number
    },
    end: {
        type: Number
    },
    makeStock: {
        type: String
    },
    makeStockValue: {
        type: String
    },
    cancelled: {
        type: Boolean
    },
    salt: {
        type: String
    },
    signature: {
        type: String
    },
    pending: [
        {
            type: Schema.Types.Mixed
        }
    ],
    hash: {
        type: String
    },
    makeBalance: {
        type: String
    },
    makePrice: {
        type: String
    },
    takePrice: {
        type: String
    },
    makePriceUsd: {
        type: String
    },
    takePriceUsd: {
        type: String
    },
    priceHistory: [
        {
            date: {
                type: String
            },
            makeValue: {
                type: String
            },
            takeValue: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        default: "open"
    }
},
    {
        versionKey: false,
        timestamps: true
    })

module.exports = mongoose.model("orders", OrderSchema);