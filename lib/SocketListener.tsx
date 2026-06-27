"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSocket, connectUserSocket } from "@/lib/socketClient";
import { updateCredits } from "@/store/slices/authSlice";

export default function SocketListener() {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    connectUserSocket(user.id);

    const socket = getSocket();

    const handleCreditsUpdated = (data: { credits: number }) => {
      console.log("Credits Updated:", data);

      dispatch(updateCredits(data.credits));
    };

    socket.on("credits:updated", handleCreditsUpdated);

    return () => {
      socket.off("credits:updated", handleCreditsUpdated);
    };
  }, [dispatch, isAuthenticated, user?.id]);

  return null;
}
