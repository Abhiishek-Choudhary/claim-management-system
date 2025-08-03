import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim",
    required: true,
  },
  approvedAmount: {
    type: Number,
    required: true,
  },
  totalDeductions: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // assuming admin is stored as a user with role
  },
  remarks: {
    type: String,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export default mongoose.model("Settlement", settlementSchema);
