const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String ,
  verified: Boolean,
  admin: Boolean,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
