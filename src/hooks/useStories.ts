import { useState, useEffect } from "react";
import { Story } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { socketService } from "@/lib/socket/socket-client";

export function useStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchStories = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/stories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setStories(data);
          } else {
            // Fallback to mock stories if API is empty for now
            setStories(getDefaultMockStories());
          }
        } else {
          setStories(getDefaultMockStories());
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories(getDefaultMockStories());
      }
    };
    fetchStories();

    // Listen for new stories in real-time
    const handleReceiveStory = (newStory: Story) => {
      setStories(prev => {
        // Check if story already exists
        if (prev.some(s => s.id === newStory.id)) return prev;
        return [newStory, ...prev];
      });
    };

    socketService.on("receive_story", handleReceiveStory);

    return () => {
      socketService.off("receive_story", handleReceiveStory);
    };
  }, [token]);

  const addStory = async (mediaUrl: string, type: "image" | "video" = "image") => {
    if (!token || !user) return;

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mediaUrl,
          type,
          userName: user.name,
          userAvatar: user.avatar
        })
      });

      if (response.ok) {
        const newStory = await response.json();
        setStories(prev => [newStory, ...prev]);
        
        // Emit to socket server for real-time delivery
        socketService.emit("new_story", newStory);
        return newStory;
      }
    } catch (error) {
      console.error("Failed to add story:", error);
    }
  };

  function getDefaultMockStories(): Story[] {
    return [
      {
        id: "s1",
        userId: "u1",
        userName: "Sarah Wilson",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        mediaUrl: "https://picsum.photos/seed/story1/400/700",
        type: "image",
        timestamp: new Date().toISOString(),
        isRead: false
      },
      {
        id: "s2",
        userId: "u2",
        userName: "Mike Chen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        mediaUrl: "https://picsum.photos/seed/story2/400/700",
        type: "image",
        timestamp: new Date().toISOString(),
        isRead: false
      },
      {
        id: "s3",
        userId: "u3",
        userName: "Alex Rivera",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        mediaUrl: "https://picsum.photos/seed/story3/400/700",
        type: "image",
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ];
  }

  const openStory = (story: Story) => {
    setSelectedStory(story);
    const index = stories.findIndex((s) => s.id === story.id);
    setCurrentIndex(index);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedStory(stories[currentIndex + 1]);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedStory(stories[currentIndex - 1]);
    }
  };

  // Auto-advance story
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedStory) {
      timer = setTimeout(nextStory, 5000);
    }
    return () => clearTimeout(timer);
  }, [selectedStory, currentIndex, stories.length]);

  return {
    selectedStory,
    currentIndex,
    openStory,
    closeStory,
    nextStory,
    prevStory,
    stories,
  };
}
