const mongoose = require("mongoose");
require('@mongoosejs/double')
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        id: {
            type: String,
            require: true,
        },
        creator: {
            type: String,
            require: true,
        },
        filetype: {
            type: String,
            require: true,
        },
        owner: {
            type: String,
            require: true,
        },
        supply: {
            type: Number,
            require: true,
        },
        collectionId: {
            type: String,
            require: true,
        },
        tokenURI: {
            type: String,
            require: true,
        },
        price: {
            type: mongoose.Schema.Types.Double,
            require: true,
        },
        unlockable: {
            type: String,
            require: true,
        },
        royalties: {
            type: mongoose.Schema.Types.Double,
            require: true,
        },
        likes: {
            type: Array,
            require: true,
            default: () => []
        },
        properties: {
            type: Array,
            require: true,
        },
        levels: {
            type: Array,
            require: true,
        },
        stats: {
            type: Array,
            require: true,
        },
        priceHistory: {
            type: Array,
            require: true,
            default: () => []
        },
        saletype: {
            type: Number,
            require: true
        },
        onsale: {
            type: Boolean,
            require: true,
            default: () => false,
        },
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("items", schema);