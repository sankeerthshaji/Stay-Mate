const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectId;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parentMobileNumber: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    address: {
      houseName: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },

    image: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },

    role: {
      type: String,
      enum: ["guest", "resident"],
      default: "guest",
    },

    roomNo: {
      type: String,
    },

    dateOfAdmission: {
      type: Date,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//static method to login user
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please enter all the fields");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Incorrect login credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect login credentials");
  }

  //if user is blocked
  if (user.isBlocked) {
    throw Error("Your account is blocked");
  }

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
