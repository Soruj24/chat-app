"use client";

import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addChat, setActiveChat } from "@/store/slices/chatSlice";
import { useRouter } from "next/navigation";
import { socketService } from "@/lib/socket/socket-client";

export function useNewGroup(onClose: () => void) {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const response = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const mappedUsers = data.map((u: any) => ({
            ...u,
            id: u._id || u.id,
          }));
          setAllUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsers]);

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleNext = () => {
    if (selectedUsers.size > 0) setStep(2);
  };

  const handleCreate = async () => {
    if (!token || !groupName || selectedUsers.size === 0) return;

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "group",
          name: groupName,
          description: description,
          participantIds: Array.from(selectedUsers)
        })
      });

      if (response.ok) {
        const chatData = await response.json();
        const mappedChat = {
          id: chatData._id,
          name: chatData.name,
          avatar: chatData.avatar,
          type: chatData.type,
          unreadCount: 0,
          description: chatData.description,
          members: chatData.participants.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            avatar: p.avatar,
            username: p.username,
            status: p.status || "offline"
          })),
        };

        dispatch(addChat(mappedChat));
        dispatch(setActiveChat(mappedChat.id));

        // Emit socket event for all participants
        socketService.emit("new_chat", {
          chat: mappedChat,
          participants: chatData.participants.map((p: any) => p._id || p.id)
        });

        onClose();
        setStep(1);
        setSelectedUsers(new Set());
        setGroupName("");
        setDescription("");
        router.push(`/chat/${mappedChat.id}`);
      } else {
        const error = await response.json();
        console.error("Failed to create group:", error.message);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    selectedUsers,
    setSelectedUsers,
    groupName,
    setGroupName,
    description,
    setDescription,
    filteredUsers,
    allUsers,
    toggleUser,
    handleNext,
    handleCreate,
  };
}
