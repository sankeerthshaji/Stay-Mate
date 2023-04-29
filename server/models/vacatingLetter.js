const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vacatingLetterSchema = new Schema(
  {
    departureDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const VacatingLetter = mongoose.model("VacatingLetter", vacatingLetterSchema);

module.exports = VacatingLetter;
