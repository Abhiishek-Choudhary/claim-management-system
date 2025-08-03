// models/Claim.js
import mongoose from "mongoose";

const postEntrySchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  views: Number,
  likes: Number,
});

const claimSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    posts: [postEntrySchema],
    mediaProof: { type: String, required: true },
    calculatedEarnings: { type:Number, default:0 },
    expectedEarnings: Number,
    deductedEarnings: Number,
    deductionReason: String,
    status: {
      type: String,
      enum: ["pending", "deducted", "confirmed", "approved", "rejected","submitted","account-approved","admin-approved"],
      default: "pending",
    },
    history: [
      {
        actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: String,
        action: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);
