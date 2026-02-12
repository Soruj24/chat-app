"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useStories } from "@/hooks/useStories";
import { StoryItem } from "./StoryItem";
import { StoryViewer } from "./StoryViewer";

export function StoriesList() {
  const {
    selectedStory,
    currentIndex,
    openStory,
    closeStory,
    nextStory,
    prevStory,
    stories,
    addStory,
  } = useStories();

  const handleAddStory = () => {
    const url = prompt("Enter image URL for your story:");
    if (url) {
      addStory(url);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto no-scrollbar bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        {/* My Story */}
        <div 
          onClick={handleAddStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full p-0.5 border-2 border-dashed border-gray-300 dark:border-gray-700 group-hover:border-blue-500 transition-colors relative">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="My Story"
                fill
                unoptimized
                className="rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white z-10">
              <Plus className="w-3 h-3" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">My Story</span>
        </div>

        {/* Others' Stories */}
        {stories.map((story) => (
          <StoryItem 
            key={story.id} 
            story={story} 
            onClick={() => openStory(story)} 
          />
        ))}
      </div>

      <StoryViewer
        selectedStory={selectedStory}
        currentIndex={currentIndex}
        stories={stories}
        onClose={closeStory}
        onNext={nextStory}
        onPrev={prevStory}
      />
    </>
  );
}
