import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Telegram-Style Chat",
  description: "A modern messaging app with Telegram-style design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden h-screen`}
        style={{ background: "var(--bg)", color: "var(--fg)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="chat-theme"
        >
          <Providers>
            <div className="flex h-full w-full overflow-hidden relative">
              <Sidebar />
              <main
                className="flex-1 flex flex-col min-w-0 relative z-10"
                style={{ background: "var(--bg)" }}
              >
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
