export default function Home() {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#8e8e93]/10 to-transparent dark:from-white/5 dark:to-transparent">
      <div className="max-w-md space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #28a8e8 0%, #0ba4e8 100%)' }}>
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Telegram-Style Chat
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          Select a chat from the sidebar to start messaging.
          <br />
          Or tap <span className="text-blue-500 font-medium">➕</span> to begin a new conversation.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-900">A</div>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-900">B</div>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-900">C</div>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500"> millions using</span>
        </div>
      </div>
    </div>
  );
}
