import Session from "../modals/Session.js";
import { chatClient, streamClient } from "./stream.js";

// How long to wait before auto-destroying a session with no participant
const NO_JOIN_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// How long to wait before destroying an abandoned session (both joined, nobody active)
const ABANDON_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// How long to keep an empty session (all users left) before destroying
const EMPTY_SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// How often to run the cleanup check
const CLEANUP_INTERVAL_MS = 30 * 1000; // every 30 seconds

async function destroySession(session, reason) {
  try {
    // Delete Stream video call
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (err) {
      // Stream resource may already be gone
    }

    // Delete Stream chat channel
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (err) {
      // Channel may already be gone
    }

    // Delete the session from DB
    await Session.findByIdAndDelete(session._id);
    console.log(`[Cleanup] Destroyed session ${session._id} — ${reason}`);
  } catch (err) {
    console.error(`[Cleanup] Failed to destroy session ${session._id}:`, err.message);
  }
}

async function cleanupStaleSessions() {
  try {
    const now = Date.now();

    // 1. Sessions where nobody joined within 2 minutes
    const noJoinCutoff = new Date(now - NO_JOIN_TIMEOUT_MS);
    const noJoinSessions = await Session.find({
      status: "active",
      participant: null,
      createdAt: { $lt: noJoinCutoff },
    });

    for (const session of noJoinSessions) {
      await destroySession(session, `no one joined after ${NO_JOIN_TIMEOUT_MS / 1000}s`);
    }

    // 2. Sessions where both users left (empty) — delete after 2 minutes
    const emptyCutoff = new Date(now - EMPTY_SESSION_TIMEOUT_MS);
    const emptySessions = await Session.find({
      status: "active",
      host: null,
      participant: null,
      lastActivity: { $lt: emptyCutoff },
    });

    for (const session of emptySessions) {
      await destroySession(session, `empty (no users) for ${EMPTY_SESSION_TIMEOUT_MS / 1000}s`);
    }

    // 3. Sessions where both joined but no heartbeat for 5 minutes (abandoned)
    const abandonCutoff = new Date(now - ABANDON_TIMEOUT_MS);
    const abandonedSessions = await Session.find({
      status: "active",
      participant: { $ne: null },
      lastActivity: { $lt: abandonCutoff },
    });

    for (const session of abandonedSessions) {
      await destroySession(session, `inactive for ${ABANDON_TIMEOUT_MS / 1000}s (abandoned)`);
    }

    const total = noJoinSessions.length + emptySessions.length + abandonedSessions.length;
    if (total > 0) {
      console.log(`[Cleanup] Cleaned up ${total} session(s)`);
    }
  } catch (error) {
    console.error("[Cleanup] Error during session cleanup:", error.message);
  }
}

export function startSessionCleanup() {
  console.log(`[Cleanup] Session auto-destroy enabled — no-join: ${NO_JOIN_TIMEOUT_MS / 1000}s, abandon: ${ABANDON_TIMEOUT_MS / 1000}s`);
  setInterval(cleanupStaleSessions, CLEANUP_INTERVAL_MS);
  cleanupStaleSessions();
}
