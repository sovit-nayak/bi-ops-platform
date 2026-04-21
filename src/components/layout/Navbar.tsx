"use client";

import { Bell, Search, RefreshCw } from "lucide-react";

const platforms = [
  { name: "QuickSight", status: "connected", color: "bg-green-400" },
  { name: "Tableau", status: "disconnected", color: "bg-gray-600" },
  { name: "Power BI", status: "disconnected", color: "bg-gray-600" },
];

export default function Navbar() {
  return (
    <div className="h-14 bg-[#050505] border-b border-white/[0.06] flex items-center justify-between px-6">

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 w-72 hover:border-white/10 transition-all">
        <Search className="w-3.5 h-3.5 text-gray-600" />
        <input
          type="text"
          placeholder="Search dashboards, datasets..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Platform pills */}
        <div className="flex items-center gap-2">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full px-2.5 py-1"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${p.color} ${p.status === "connected" ? "animate-pulse" : ""}`} />
              <span className="text-[11px] text-gray-500">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Sync button */}
        <button className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 text-gray-500 hover:text-white text-xs px-3 py-1.5 rounded-xl transition-all">
          <RefreshCw className="w-3 h-3" />
          Sync
        </button>

        {/* Notifications */}
        <button className="relative p-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 rounded-xl transition-all">
          <Bell className="w-3.5 h-3.5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>

      </div>
    </div>
  );
}