const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    createdAt: { type: Date, default: Date.now, expires: 60 }
    // expires in 60 seconds (1 minutes)
  },
  { timestamps: true }
);

// Create a compound unique index on email and type
otpSchema.index({ email: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Otp", otpSchema);
