const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveLetterSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    comments: {
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

const LeaveLetter = mongoose.model("LeaveLetter", leaveLetterSchema);

module.exports = LeaveLetter;
