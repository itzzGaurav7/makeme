"use client";

import React, { useState } from "react";
import {
  Home,
  User,
  Settings,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarLinks = [
    { icon: <Home />, label: "Home", href: "/" },
    { icon: <User />, label: "Profile", href: "/profile" },
    { icon: <MessageCircle />, label: "Messages", href: "/messages" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-gray-800 text-white h-screen transition-all duration-300 
        ${isOpen ? "w-64" : "w-20"} relative`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 bg-gray-700 p-2 rounded-full"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>

        <nav className="pt-16">
          {sidebarLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center p-4 hover:bg-gray-700 transition-colors"
            >
              <span className="mr-4">{link.icon}</span>
              {isOpen && <span>{link.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
