"use client";

import Navigation from "@/components/Navigation";
import MenuSidebar from "@/components/MenuSidebar";
import ChatInterface from "@/components/ChatInterface";

export default function CustomerPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <MenuSidebar />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
