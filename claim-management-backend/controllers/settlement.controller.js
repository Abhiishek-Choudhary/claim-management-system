// controllers/settlement.controller.js
import Claim from "../models/Claim.js";
import Settlement from "../models/Settlement.js";

export const generateSettlements = async (req, res) => {
  try {
    // Step 1: Get all Approved claims
    const approvedClaims = await Claim.find({ status: "Approved" }).lean();

    if (approvedClaims.length === 0) {
      return res.status(404).json({ success: false, message: "No approved claims found" });
    }

    // Step 2: Group by userId
    const grouped = {};

    for (const claim of approvedClaims) {
      const { userId, approvedEarnings, deductions, _id, approvedBy } = claim;

      if (!grouped[userId]) {
        grouped[userId] = {
          totalApproved: 0,
          totalDeductions: 0,
          claimIds: [],
          approvedBy: approvedBy || null,
        };
      }

      grouped[userId].totalApproved += approvedEarnings || 0;
      grouped[userId].totalDeductions += deductions?.amount || 0;
      grouped[userId].claimIds.push(_id);
    }

    // Step 3: Create Settlement docs
    const settlementsToInsert = Object.entries(grouped).map(([userId, data]) => ({
      userId,
      claimIds: data.claimIds,
      approvedAmount: data.totalApproved,
      totalDeductions: data.totalDeductions,
      status: "Pending", // could be "Pending" or "Completed"
      approvedBy: data.approvedBy,
    }));

    // Step 4: Insert in DB
    const inserted = await Settlement.insertMany(settlementsToInsert);

    res.status(201).json({ success: true, message: "Settlements generated", data: inserted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate settlements" });
  }
};


export const exportSettlementReport = async (req, res) => {
  try {
    const {
      format = "json",
      startDate,
      endDate,
      status,
      userId,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const skip = (page - 1) * limit;

    const settlements = await Settlement.find(filter)
      .populate("userId", "username email")
      .populate("approvedBy", "username email")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    if (format === "csv") {
      const csvData = settlements.map((s) => ({
        Username: s.userId?.username || "",
        Email: s.userId?.email || "",
        Amount: s.approvedAmount,
        Deductions: s.totalDeductions,
        Status: s.status,
        CreatedAt: s.createdAt,
        ApprovedBy: s.approvedBy?.username || "",
      }));

      let csv = "Username,Email,Amount,Deductions,Status,CreatedAt,ApprovedBy\n";
      csv += csvData
        .map((row) =>
          [
            row.Username,
            row.Email,
            row.Amount,
            row.Deductions,
            row.Status,
            row.CreatedAt,
            row.ApprovedBy,
          ].join(",")
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=settlement_report.csv");
      return res.send(csv);
    }

    res.json({ success: true, data: settlements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to export report" });
  }
};
