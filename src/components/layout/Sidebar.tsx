"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Database,
  Users,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Dashboards", href: "/dashboards", icon: BarChart3 },
  { name: "Datasets", href: "/datasets", icon: Database },
  { name: "Users", href: "/users", icon: Users },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#050505] border-r border-white/[0.06]">

      {/* Logo */}
<div className="flex items-center justify-center px-5 py-5 border-b border-white/[0.06]">
  <Link href="/">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="4" x2="5" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="13" y1="4" x2="13" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="5" y1="9" x2="13" y2="9" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="5" cy="4" r="1.5" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0s"/>
        </circle>
        <circle cx="13" cy="4" r="1.5" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        <circle cx="5" cy="14" r="1.5" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <circle cx="13" cy="14" r="1.5" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="1.5s"/>
        </circle>
        <circle cx="9" cy="9" r="1.2" fill="none" stroke="white" strokeWidth="1.3">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  </Link>
</div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-orange-500/15 text-orange-300 border border-orange-500/25"
                  : "text-gray-500 hover:bg-white/[0.04] hover:text-white border border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-400" : "text-gray-600")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Platform badge */}
      <div className="px-4 py-3 mx-3 mb-3 bg-orange-500/8 border border-orange-500/15 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-orange-300 font-medium">QuickSight connected</span>
        </div>
        <p className="text-[9px] text-gray-600">Last synced 5 mins ago</p>
      </div>

      {/* Bottom user */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">Sovit</p>
            <p className="text-[10px] text-gray-500 truncate">Admin · Helm</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
      </div>

    </div>
  );
}