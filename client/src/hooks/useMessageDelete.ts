"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { socketService } from "@/lib/socket/socket-client";
import { deleteMessage as deleteMessageAction } from "@/store/slices/chatSlice";

interface UseMessageDeleteOptions {
  chatId: string;
}

export function useMessageDelete({ chatId }: UseMessageDeleteOptions) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const deleteForEveryone = useCallback((messageId: string) => {
    if (!chatId || !messageId || !user?.id) return;
    socketService.deleteMessage(chatId, messageId, true);
    dispatch(deleteMessageAction({ chatId, messageId }));
  }, [chatId, user?.id, dispatch]);

  const deleteForMe = useCallback((messageId: string) => {
    if (!chatId || !messageId || !user?.id) return;
    socketService.deleteMessage(chatId, messageId, false);
    dispatch(deleteMessageAction({ chatId, messageId }));
  }, [chatId, user?.id, dispatch]);

  return { deleteForEveryone, deleteForMe };
}