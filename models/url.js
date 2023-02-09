// import mongoose and nanoID
const mongoose = require("mongoose");
const shortid = require("shortid");

// create new schema
// schema should have
// 1- nanoId (which will be used as link) absolutely unique
// 2- original URL ("where user will be reidrected")

const urlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortid,
  },
  clicks: {
    type: String,
    required: true,
    default: 0,
  },
  timestamp: {
    required: true,
    type: Date,
    default: Date.now,
  },
});

// create static method for adding new url
// urlSchema.statics.getAllLinks = function () {
//   return this.find();
// };
urlSchema.statics.getAllLinks = function () {
  return this.find();
};

// create static methoid for upodating and deleting

// export modules
module.exports = new mongoose.model("url", urlSchema);
