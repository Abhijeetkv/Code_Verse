import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // NEW
    hostConnected: {
      type: Boolean,
      default: true,
    },

    // NEW
    participantConnected: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    callId: {
      type: String,
      default: "",
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;