const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        address: {
            type: String,
            require: true,
        },
        name: {
            type: String,
            require: true,
        },

    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("admins", schema);