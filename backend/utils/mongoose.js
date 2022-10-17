import mongoose from "mongoose";
const MONGO_DB_URL = "mongodb+srv://Phoenix243:jmamfPGyj76Ajm6R@cluster0.wjh6smv.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_DB_URL, (err) => {
  if (err) throw err;
  console.log("Connected to the DB");
});

export default mongoose.connection;