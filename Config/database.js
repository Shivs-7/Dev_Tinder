
const mongoose = require("mongoose");

const connectdb = async () => {
  return mongoose.connect("mongodb://127.0.0.1:27017/DevTinderLocal");
};

module.exports = connectdb;