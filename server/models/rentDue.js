const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentDueSchema = new Schema(
  {
    rentMonth: {
      type: String,
      required: true,
    },
    rentDate: {
      type: Date,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    lastDateWithoutFine: {
      type: Date,
      required: true,
    },
    lastDateWithFine: {
      type: Date,
      required: true,
    },
    fine: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const RentDue = mongoose.model("RentDue", rentDueSchema);
module.exports = RentDue;
