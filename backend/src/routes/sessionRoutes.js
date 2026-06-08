import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import {
  createSession,
  endSession,
  leaveSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  heartbeat,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectedRoute, createSession);
router.get("/active", protectedRoute, getActiveSessions);
router.get("/my-recent", protectedRoute, getMyRecentSessions);


router.get("/:id", protectedRoute, getSessionById);
router.post("/:id/join", protectedRoute, joinSession);
router.post("/:id/heartbeat", protectedRoute, heartbeat);
router.post("/:id/leave", protectedRoute, leaveSession);
router.post("/:id/end", protectedRoute, endSession);

export default router;
