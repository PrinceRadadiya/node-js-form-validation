const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersehema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirm: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
usersehema.methods.genrateAurtToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.prince);
    // console.log("----------------", token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send("the error" + error);
    console.log("the error" + error);
  }
};
usersehema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const housedata = new mongoose.model("housedata", usersehema);
module.exports = housedata;
  