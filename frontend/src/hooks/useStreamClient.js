import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/session.js";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // Track initialization to prevent duplicate calls
  const isInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Use stable primitive values as dependencies instead of the session object
  const callId = session?.callId;
  const sessionStatus = session?.status;

  useEffect(() => {
    let cancelled = false;
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (!callId) return;
      if (!isHost && !isParticipant) return;
      if (sessionStatus === "completed") return;

      // Prevent duplicate initialization
      if (isInitializedRef.current || isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        if (cancelled) return;

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (cancelled) return;

        setStreamClient(client);

        videoCall = client.call("default", callId);
        await videoCall.join({ create: true });

        if (cancelled) return;

        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        // Only connect if not already connected
        if (!chatClientInstance.userID) {
          await chatClientInstance.connectUser(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );
        }

        if (cancelled) return;

        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", callId);
        await chatChannel.watch();
        setChannel(chatChannel);

        isInitializedRef.current = true;
      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        isInitializingRef.current = false;
        if (!cancelled) {
          setIsInitializingCall(false);
        }
      }
    };

    if (!loadingSession) initCall();

    // cleanup - performance reasons
    return () => {
      cancelled = true;
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance?.userID) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        } finally {
          isInitializedRef.current = false;
          isInitializingRef.current = false;
        }
      })();
    };
  }, [callId, sessionStatus, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;