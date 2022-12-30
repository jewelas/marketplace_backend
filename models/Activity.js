const mongoose = require("mongoose");
require('@mongoosejs/double')
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        type: {
            type: Number,
            require: true,
        },
        collectionId: {
            type: String,
            require: true,
        },
        tokenId: {
            type: String,
            require: true,
        },
        summary: {
            type: String,
            require: true,
        },
        user: {
            type: String,
            require: true,
        },
        price: {
            type: mongoose.Schema.Types.Double,
            require: true,
            default: () => 0.0,
        },
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("activitys", schema);