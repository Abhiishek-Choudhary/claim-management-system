import express from "express";
import { exportSettlementReport } from "../controllers/settlement.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { generateSettlements } from "../controllers/settlement.controller.js";

const router = express.Router();

router.get("/export", isAuthenticated, authorizeRoles("admin"), exportSettlementReport);
router.post("/generate", isAuthenticated, authorizeRoles("admin"), generateSettlements);

export default router;
