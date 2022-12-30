const mongoose = require("mongoose");
require("@mongoosejs/double");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const schema = new Schema(
  {
    blockchain: {
      type: String,
      require: true,
    },
    single: {
      type: Boolean,
      require: true,
    },
    collectionId: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    volume: {
      type: mongoose.Schema.Types.Double,
      require: true,
      default: () => 0.0,
    },
    likes: {
      type: Array,
      require: true,
      default: () => [],
    },
    image: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: () => "",
    },
    owner: {
      type: String,
      require: true,
    },
    standard: {
      type: String,
      require: true,
    },
    symbol: {
      type: String,
      require: true,
    },
    cover: {
      type: String,
      default: () => "img/collections/collection_banner.jpg",
      require: true,
    },
    verified: {
      type: Number,
      require: true,
      default: () => -1,
    },
    website: {
      type: String,
      require: true,
    },
    telegram: {
      type: String,
      require: true,
    },
    discord: {
      type: String,
      require: true,
    },
    twitter: {
      type: String,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("collections", schema);
