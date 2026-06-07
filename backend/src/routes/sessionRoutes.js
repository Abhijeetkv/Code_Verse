import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  // heartbeat,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectedRoute, createSession);
router.get("/active", getActiveSessions);
router.get("/my-recent", protectedRoute, getMyRecentSessions);

router.get("/test", (req, res) => {
  res.json({ message: "session routes working" });
});

router.get("/:id", protectedRoute, getSessionById);
router.post("/:id/join", protectedRoute, joinSession);
// router.post("/:id/heartbeat", protectedRoute, heartbeat);
router.post("/:id/end", protectedRoute, endSession);

export default router;
