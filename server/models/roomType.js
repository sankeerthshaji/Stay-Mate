const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomTypeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      unique: true,
    },
    rent: {
      type: Number,
      required: true,
      unique: true,
    },
    admissionFees: {
      type: Number,
      required: true,
    },
    image: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

const RoomType = mongoose.model("RoomType", roomTypeSchema);

module.exports = RoomType;
