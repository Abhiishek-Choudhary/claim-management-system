// controllers/claim.controller.js
import Claim from "../models/Claim.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { stringify } from "csv-stringify";
import { Parser } from "json2csv"; // 📦 install with: npm i json2csv
import { calculateEarnings } from "../utils/earningsCalculator.js";

export const submitClaim = async (req, res) => {
  try {
    const posts = JSON.parse(req.body.posts); // from multipart/form-data
    const expectedEarnings = req.body.expectedEarnings;
    const mediaProof = req.file ? req.file.path : null;

    if (!mediaProof) {
      return res.status(400).json({ message: "Media proof is required" });
    }

    const fetchedPosts = await Post.find({
      _id: { $in: posts.map((p) => p.postId) },
    });

    const claimPosts = fetchedPosts.map((post) => {
      const submittedPost = posts.find((p) => p.postId === post._id.toString());
      return {
        postId: post._id,
        views: post.views,
        likes: post.likes,
        ...submittedPost,
      };
    });

    const calculatedEarnings = calculateEarnings(claimPosts);

    const claim = await Claim.create({
      userId: req.user.id,
      posts: claimPosts,
      mediaProof,
      calculatedEarnings: calculatedEarnings,
      expectedEarnings: expectedEarnings,
      history: [
        {
          actionBy: req.user.id,
          role: req.user.role,
          action: "submitted",
          message: "Claim submitted",
        },
      ],
    });

    res.status(201).json(claim);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Claim submission failed", error: err.message });
  }
};

// controllers/claim.controller.js
export const getUserClaims = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Claim.countDocuments({ userId });
    const claims = await Claim.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      claims,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all claims for Account with optional filters
export const getAllClaimsForReview = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const claims = await Claim.find(filter)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch claims", error: err.message });
  }
};

// Approve claim directly
export const approveClaimByAccount = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "approved";
    claim.history.push({
      actionBy: req.user.id,
      role: req.user.role,
      action: "approved",
      message: "Claim approved by Account",
    });

    await claim.save();
    res.status(200).json({ message: "Claim approved", claim });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};

// Apply deduction
export const applyDeduction = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "deducted";
    claim.deductedEarnings = amount;
    claim.deductionReason = reason;

    claim.history.push({
      actionBy: req.user.id,
      role: req.user.role,
      action: "deducted",
      message: `Deduction of ₹${amount} applied: ${reason}`,
    });

    await claim.save();
    res.status(200).json({ message: "Deduction applied", claim });
  } catch (err) {
    res.status(500).json({ message: "Deduction failed", error: err.message });
  }
};

// User accepts the deduction
export const acceptDeduction = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // Only the owner can accept
    if (claim.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (claim.status !== "deducted")
      return res
        .status(400)
        .json({ message: "Claim is not in deducted state" });

    claim.status = "account-approved";
    claim.history.push({
      actionBy: req.user.id,
      role: "user",
      action: "accepted-deduction",
      message: "User accepted deduction and finalized the claim",
    });

    await claim.save();
    res.status(200).json({ message: "Deduction accepted", claim });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to accept deduction", error: err.message });
  }
};

export const rejectDeduction = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // Fix: Ensure userId is safely compared
    if (claim.userId?.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (claim.status !== "deducted")
      return res
        .status(400)
        .json({ message: "Claim is not in deducted state" });

    claim.status = "submitted";
    claim.history.push({
      actionBy: req.user.id,
      role: "user",
      action: "rejected-deduction",
      message: "User rejected the deduction and resubmitted the claim",
    });

    try {
      await claim.save();
      res
        .status(200)
        .json({ message: "Deduction rejected, claim resubmitted", claim });
    } catch (saveErr) {
      console.error("Claim save failed:", saveErr);
      res
        .status(500)
        .json({ message: "Failed to save claim", error: saveErr.message });
    }
  } catch (err) {
    console.error("Reject deduction error:", err);
    res
      .status(500)
      .json({ message: "Failed to reject deduction", error: err.message });
  }
};

// Admin: Get all account-approved claims
export const getAllApprovedClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      status: { $in: ["approved", "account-approved"] },
    })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch approved claims", error: err.message });
  }
};

// Admin: Approve final claim
export const finalApproveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.status !== "approved" && claim.status !== "account-approved")
      return res
        .status(400)
        .json({ message: "Claim not ready for final approval" });

    claim.status = "admin-approved";
    claim.history.push({
      actionBy: req.user.id,
      role: "admin",
      action: "final-approved",
      message: "Admin approved the claim",
    });

    await claim.save();
    res.status(200).json({ message: "Claim approved", claim });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve claim", error: err.message });
  }
};

// Admin: Reject final claim
export const finalRejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.status !== "approved" && claim.status !== "account-approved")
      return res
        .status(400)
        .json({ message: "Claim not ready for final decision" });

    claim.status = "rejected";
    claim.history.push({
      actionBy: req.user.id,
      role: "admin",
      action: "final-rejected",
      message: "Admin rejected the claim",
    });

    await claim.save();
    res.status(200).json({ message: "Claim rejected", claim });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject claim", error: err.message });
  }
};

export const getFilteredClaims = async (req, res) => {
  try {
    const { status, startDate, endDate, username, role } = req.query;
    const query = {};

    // Filter by status
    if (status) query.status = status;

    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Filter by username/email (joins user collection)
    let userIds = [];
    if (username) {
      const users = await User.find({
        $or: [
          { username: { $regex: username, $options: "i" } },
          { email: { $regex: username, $options: "i" } },
        ],
      });
      userIds = users.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    // Optional role-based filtering (e.g., Account users only see claims in "Under Review" state)
    if (role === "account") {
      query.status = "Under Review";
    }

    const claims = await Claim.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to filter claims", details: err.message });
  }
};

export const getSettlementReport = async (req, res) => {
  try {
    const claims = await Claim.find({
      status: { $in: ["admin-approved", "Settled"] },
    })
      .populate("userId", "username email")
      .sort({ updatedAt: -1 });

    const settledEarning = claims.expectedEarnings - claims.deductedEarnings;

    const reportData = claims.map((claim) => ({
      Username: claim.userId.username,
      Email: claim.userId.email,
      ClaimID: claim._id.toString(),
      Status: claim.status,
      calculatedEarnings: claim.calculatedEarnings || "N/A",
      ExpectedEarnings: claim.expectedEarnings,
      ApprovedEarnings: claim.approvedEarnings || "N/A",
      SettledAmount: settledEarning || "N/A",
      UpdatedAt: claim.updatedAt.toISOString(),
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(reportData);

    res.header("Content-Type", "text/csv");
    res.attachment("settlement-report.csv");
    return res.send(csv);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate report", details: err.message });
  }
};

export const exportClaims = async (req, res) => {
  try {
    const {
      format = "csv", // csv or json
      page = 1,
      limit = 100,
      status,
      userId,
      from,
      to,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId; // ✅ Corrected
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = Claim.find(filter)
      .populate("user", "username email")
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
      .cursor(); // returns a stream

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="claims.${format}"`
    );

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");

      const csvStream = stringify({
        header: true,
        columns: {
          _id: "Claim ID",
          username: "User",
          expectedEarnings: "Expected Earnings",
          approvedEarnings: "Approved Earnings",
          status: "Status",
          createdAt: "Created At",
        },
      });

      query.on("data", (doc) => {
        csvStream.write({
          _id: doc._id,
          username: doc.user?.username || "N/A",
          expectedEarnings: doc.expectedEarnings,
          approvedEarnings: doc.approvedEarnings,
          status: doc.status,
          createdAt: doc.createdAt,
        });
      });

      query.on("end", () => csvStream.end());

      csvStream.pipe(res);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.write("[");
      let first = true;

      query.on("data", (doc) => {
        const output = JSON.stringify({
          _id: doc._id,
          username: doc.user?.username || "N/A",
          expectedEarnings: doc.expectedEarnings,
          approvedEarnings: doc.approvedEarnings,
          status: doc.status,
          createdAt: doc.createdAt,
        });

        if (!first) res.write(",");
        res.write(output);
        first = false;
      });

      query.on("end", () => {
        res.write("]");
        res.end();
      });
    }
  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ error: "Failed to export claims." });
  }
};
