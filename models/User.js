const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        wallet: {
            type: String,
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        bio: {
            type: String,
            require: true,
        },
        avatar: {
            type: String,
            require: true,
        },
        cover: {
            type: String,
            default: () => "img/user/banner.jpg",
            require: true,
        },
        email: {
            type: String,
            default: () => "www@example.com",
            require: true,
        },
        twitter: {
            type: String,
            default: () => "@twittername",
            require: true,
        },
        instagram: {
            type: String,
            default: () => "@instagramname",
            require: true,
        },
        yoursitename: {
            type: String,
            default: () => "yoursitename.com",
            require: true,
        },
        followers: {
            type: Array,
            default: () => [],
            require: true,
        }
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("users", schema);