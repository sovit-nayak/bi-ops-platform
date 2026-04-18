"use client";

import { Bell, Search, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { name: "QuickSight", status: "connected", color: "bg-green-500" },
  { name: "Tableau", status: "disconnected", color: "bg-gray-500" },
  { name: "Power BI", status: "disconnected", color: "bg-gray-500" },
];

export default function Navbar() {
  return (
    <div className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
      
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search dashboards, datasets..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        
        {/* Platform status pills */}
        <div className="flex items-center gap-2">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 bg-gray-900 rounded-full px-3 py-1"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
              <span className="text-xs text-gray-400">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Sync button */}
        <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
          Sync
        </button>

        {/* Notifications */}
        <button className="relative p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

      </div>
    </div>
  );
}
