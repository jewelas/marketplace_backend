const mongoose = require("mongoose");
require('@mongoosejs/double')
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
        user: {
            type: String,
            require: true,
        },
        amount: {
            type: mongoose.Schema.Types.Double,
            require: true,
            default: () => 0.0,
        },
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("traderecords", schema);