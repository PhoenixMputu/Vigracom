const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("You are connected to a Mongoose database !"))
  .catch((e) => console.log("Connection failed\n", e));

module.exports = mongoose.connection;