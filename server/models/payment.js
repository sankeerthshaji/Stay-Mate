const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rentAmount: {
            type: Number,
            required: true,
        },
        dateOfPayment: {
            type: Date,
            default: Date.now,
        },
    }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;