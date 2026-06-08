import { requireAuth } from "@clerk/express";
import User from "../modals/User.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const auth = req.auth();
      const clerkId = auth?.userId;

      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No Clerk User ID",
        });
      }

      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Protected Route Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
];