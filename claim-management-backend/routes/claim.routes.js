// routes/claim.routes.js
import express from "express";
import { submitClaim, getUserClaims,getAllApprovedClaims,approveClaimByAccount,applyDeduction
    ,getAllClaimsForReview,acceptDeduction,rejectDeduction,finalApproveClaim,finalRejectClaim
 } from "../controllers/claim.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { getFilteredClaims } from "../controllers/claim.controller.js";
import { getSettlementReport } from "../controllers/claim.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { exportClaims } from "../controllers/claim.controller.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// User routes
router.post(
  "/",
  verifyUser,
  authorizeRoles("user"),
  upload.single("mediaProof"),
  submitClaim
);

router.get("/user", verifyUser, authorizeRoles("user"), getUserClaims);
// Account Routes
router.get("/review", verifyUser, authorizeRoles("account", "admin"), getAllClaimsForReview);
router.put("/approve/:id", verifyUser, authorizeRoles("account"), approveClaimByAccount);
router.put("/deduct/:id", verifyUser, authorizeRoles("account"), applyDeduction);
// Deduction response by User
router.put("/deduction/accept/:id", verifyUser, authorizeRoles("user"), acceptDeduction);
router.put("/deduction/reject/:id", verifyUser, authorizeRoles("user"), rejectDeduction);
// Final approval actions
router.get("/admin/approved", verifyUser, authorizeRoles("admin"), getAllApprovedClaims);
router.put("/admin/approve/:id", verifyUser, authorizeRoles("admin"), finalApproveClaim);
router.put("/admin/reject/:id", verifyUser, authorizeRoles("admin"), finalRejectClaim);

router.get("/filter", isAuthenticated, authorizeRoles("admin", "account"), getFilteredClaims);

router.get("/settlement-report", isAuthenticated, authorizeRoles("admin"), getSettlementReport);

router.get(
  "/export",
  isAuthenticated,
  authorizeRoles("admin", "account"),
  exportClaims
);

export default router;
