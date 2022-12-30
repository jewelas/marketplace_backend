const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        collectionId: {
            type: String,
            require: true,
        },
        tokenId: {
            type: String,
            require: true,
        },
        bidder: {
            type: String,
            require: true,
        },
        bidAmount: {
            type: Number,
            require: true,
        },
        bidExpiration: {
            type: Number,
            require: true,
        }
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("bids", schema);