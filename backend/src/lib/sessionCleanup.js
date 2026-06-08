import Session from "../modals/Session.js";
import { chatClient, streamClient } from "./stream.js";

// Host created room but nobody joined
const NO_JOIN_TIMEOUT_MS = 30 * 60 * 1000; // 30 min

// Both users disconnected
const EMPTY_SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 min

// Nobody sent heartbeat
const ABANDON_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 sec

async function destroySession(session, reason) {
  try {
    try {
      const call = streamClient.video.call(
        "default",
        session.callId
      );

      await call.delete({ hard: true });
    } catch (err) {
      console.log(
        "[Cleanup] Stream call already deleted"
      );
    }

    try {
      const channel = chatClient.channel(
        "messaging",
        session.callId
      );

      await channel.delete();
    } catch (err) {
      console.log(
        "[Cleanup] Stream channel already deleted"
      );
    }

    await Session.findByIdAndDelete(
      session._id
    );

    console.log(
      `[Cleanup] Destroyed session ${session._id} (${reason})`
    );
  } catch (error) {
    console.error(
      `[Cleanup] Failed deleting ${session._id}:`,
      error.message
    );
  }
}

async function cleanupStaleSessions() {
  try {
    const now = Date.now();

    // ----------------------------------
    // 1. Nobody joined room for 30 mins
    // ----------------------------------

    const noJoinCutoff = new Date(
      now - NO_JOIN_TIMEOUT_MS
    );

    const noJoinSessions =
      await Session.find({
        status: "active",

        participant: null,

        hostConnected: false,

        createdAt: {
          $lt: noJoinCutoff,
        },
      });

    for (const session of noJoinSessions) {
      await destroySession(
        session,
        "No participant joined"
      );
    }

    // ----------------------------------
    // 2. Both users disconnected
    // ----------------------------------

    const emptyCutoff = new Date(
      now - EMPTY_SESSION_TIMEOUT_MS
    );

    const emptySessions =
      await Session.find({
        status: "active",

        hostConnected: false,

        participantConnected: false,

        lastActivity: {
          $lt: emptyCutoff,
        },
      });

    for (const session of emptySessions) {
      await destroySession(
        session,
        "All users disconnected"
      );
    }

    // ----------------------------------
    // 3. Room abandoned
    // ----------------------------------

    const abandonCutoff = new Date(
      now - ABANDON_TIMEOUT_MS
    );

    const abandonedSessions =
      await Session.find({
        status: "active",

        participant: {
          $ne: null,
        },

        lastActivity: {
          $lt: abandonCutoff,
        },
      });

    for (const session of abandonedSessions) {
      await destroySession(
        session,
        "Heartbeat timeout"
      );
    }

    const total =
      noJoinSessions.length +
      emptySessions.length +
      abandonedSessions.length;

    if (total > 0) {
      console.log(
        `[Cleanup] Removed ${total} stale session(s)`
      );
    }
  } catch (error) {
    console.error(
      "[Cleanup] Error:",
      error.message
    );
  }
}

export function startSessionCleanup() {
  console.log(
    `[Cleanup] Started
    No Join Timeout: ${
      NO_JOIN_TIMEOUT_MS / 60000
    } min
    Empty Timeout: ${
      EMPTY_SESSION_TIMEOUT_MS / 60000
    } min
    Abandon Timeout: ${
      ABANDON_TIMEOUT_MS / 60000
    } min`
  );

  setInterval(
    cleanupStaleSessions,
    CLEANUP_INTERVAL_MS
  );

  cleanupStaleSessions();
}