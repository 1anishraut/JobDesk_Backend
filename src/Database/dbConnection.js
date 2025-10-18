const mongoose = require("mongoose");

 const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log("DB CONNECTION ERROR: " + err);
  }
};

module.exports = { connectDB };