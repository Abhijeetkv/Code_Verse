import { requireAuth, clerkClient } from "@clerk/express";
import User from "../modals/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectedRoute = [
  requireAuth(),

  async (req, res, next) => {
    try {
      // Get auth data
      const { userId: clerkId } = await req.auth();

      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No Clerk User ID",
        });
      }

      // Check if user exists in MongoDB
      let user = await User.findOne({ clerkId });

      // Create user if not found
      if (!user) {
        console.log(`Creating user for Clerk ID: ${clerkId}`);

        const clerkUser = await clerkClient.users.getUser(clerkId);

        user = await User.create({
          clerkId: clerkUser.id,
          email:
            clerkUser.emailAddresses?.[0]?.emailAddress || "",
          name:
            `${clerkUser.firstName || ""} ${
              clerkUser.lastName || ""
            }`.trim() || "User",
          profileImage: clerkUser.imageUrl || "",
        });

        // Sync with Stream
        await upsertStreamUser({
          id: user.clerkId,
          name: user.name,
          image: user.profileImage,
        });

        console.log(
          `User ${user.clerkId} created successfully`
        );
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("Protected Route Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
];