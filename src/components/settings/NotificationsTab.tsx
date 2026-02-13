"use client";

interface NotificationsTabProps {
  settings: {
    showNotifications: boolean;
    messagePreview: boolean;
    soundEffects: boolean;
  };
  onChange: (settings: Partial<NotificationsTabProps["settings"]>) => void;
}

export function NotificationsTab({ settings, onChange }: NotificationsTabProps) {
  const items = [
    { id: "showNotifications", label: "Show Notifications", description: "Get real-time updates when you receive a message" },
    { id: "messagePreview", label: "Message Preview", description: "Show message content in notifications" },
    { id: "soundEffects", label: "Sound Effects", description: "Play sounds for incoming messages" },
  ] as const;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</h4>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings[item.id]} 
              onChange={(e) => onChange({ [item.id]: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
