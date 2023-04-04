const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//static method to login admin
adminSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please enter all the fields");
  }
  const admin = await this.findOne({ email });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  if (password !== admin.password) {
    throw new Error("Invalid credentials");
  }

  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
