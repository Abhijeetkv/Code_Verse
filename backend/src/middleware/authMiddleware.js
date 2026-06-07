import { requireAuth } from "@clerk/express";
import User from "../modals/User.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      console.log("Auth object:", req.auth);

      const clerkId = req.auth?.userId;

      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No Clerk User ID",
        });
      }

      console.log("Clerk ID:", clerkId);

      const user = await User.findOne({ clerkId });

      if (!user) {
        console.log("User not found in DB for Clerk ID:", clerkId);

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