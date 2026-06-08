import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../modals/Session.js";
import mongoose from "mongoose";

// Helper: destroy Stream resources and delete session
async function destroySessionResources(session) {
  try {
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });
  } catch (err) {
    console.log("Error deleting Stream call:", err.message);
  }

  try {
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();
  } catch (err) {
    console.log("Error deleting Stream channel:", err.message);
  }

  await Session.findByIdAndDelete(session._id);

  console.log(
    `[Session] Destroyed session ${session._id}`
  );
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "Problem and difficulty are required",
      });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      hostConnected: true,
      participantConnected: false,
      callId,
    });

    await streamClient.video
      .call("default", callId)
      .getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: {
            problem,
            difficulty,
            sessionId: session._id.toString(),
          },
        },
      });

    const channel = chatClient.channel(
      "messaging",
      callId,
      {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      }
    );

    await channel.create();

    res.status(201).json({
      session,
    });
  } catch (error) {
    console.log(
      "Error creating session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getActiveSessions(req, res) {
  try {
    const sessions = await Session.find({
      status: "active",
    })
      .populate(
        "host",
        "name email clerkId profileImage"
      )
      .populate(
        "participant",
        "name email clerkId profileImage"
      )
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.log(
      "Error fetching active sessions:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMyRecentSessions(
  req,
  res
) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [
        { host: userId },
        { participant: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.log(
      "Error fetching recent sessions:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getSessionById(
  req,
  res
) {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    const session = await Session.findById(id)
      .populate(
        "host",
        "name email clerkId profileImage"
      )
      .populate(
        "participant",
        "name email clerkId profileImage"
      );

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json({
      session,
    });
  } catch (error) {
    console.log(
      "Error fetching session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Host rejoining
    if (
      session.host &&
      session.host.toString() ===
        userId.toString()
    ) {
      session.hostConnected = true;
      session.lastActivity = new Date();

      await session.save();

      return res.status(200).json({
        session,
        rejoined: true,
      });
    }

    // Participant rejoining
    if (
      session.participant &&
      session.participant.toString() ===
        userId.toString()
    ) {
      session.participantConnected = true;
      session.lastActivity = new Date();

      await session.save();

      return res.status(200).json({
        session,
        rejoined: true,
      });
    }

    // New participant joining
    if (session.participant) {
      return res.status(400).json({
        message:
          "Session already has a participant",
      });
    }

    session.participant = userId;
    session.participantConnected = true;
    session.lastActivity = new Date();

    await session.save();

    const channel = chatClient.channel(
      "messaging",
      session.callId
    );

    await channel.addMembers([clerkId]);

    res.status(200).json({
      session,
    });
  } catch (error) {
    console.log(
      "Error joining session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function rejoinSession(
  req,
  res
) {
  try {
    const { id } = req.params;

    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    let allowed = false;

    if (
      session.host &&
      session.host.toString() ===
        userId.toString()
    ) {
      session.hostConnected = true;
      allowed = true;
    }

    if (
      session.participant &&
      session.participant.toString() ===
        userId.toString()
    ) {
      session.participantConnected = true;
      allowed = true;
    }

    if (!allowed) {
      return res.status(403).json({
        message:
          "You are not part of this session",
      });
    }

    session.lastActivity = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(
      "Error rejoining session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function heartbeat(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.lastActivity = new Date();

    await session.save();

    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(
      "Error in heartbeat:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function leaveSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const isHost =
      session.host &&
      session.host.toString() ===
        userId.toString();

    const isParticipant =
      session.participant &&
      session.participant.toString() ===
        userId.toString();

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        message:
          "You are not part of this session",
      });
    }

    if (isHost) {
      session.hostConnected = false;
    }

    if (isParticipant) {
      session.participantConnected = false;
    }

    try {
      const channel = chatClient.channel(
        "messaging",
        session.callId
      );

      await channel.removeMembers([
        clerkId,
      ]);
    } catch (err) {
      console.log(
        "Error removing member:",
        err.message
      );
    }

    session.lastActivity = new Date();

    await session.save();

    res.status(200).json({
      message: "You left the session",
      session,
    });
  } catch (error) {
    console.log(
      "Error leaving session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (
      session.host?.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        message:
          "Only the host can end the session",
      });
    }

    await destroySessionResources(
      session
    );

    res.status(200).json({
      message:
        "Session ended and deleted successfully",
    });
  } catch (error) {
    console.log(
      "Error ending session:",
      error.message
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
}