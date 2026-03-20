import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore.js";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

// Socket.io hook for real-time features
const useSocket = () => {
  const socketRef = useRef(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    // Announce presence
    socketRef.current.emit("user:join", {
      userId: user._id,
      name: user.name,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return socketRef.current;
};

export default useSocket;
