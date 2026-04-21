"use client";

import { useState } from "react";
import { BarChart3, Search, User, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const dashboards = [
  { id: 1, name: "Executive Revenue Overview", owner: "Sarah K.", team: "Finance", lastViewed: "2 hours ago", views: 342, health: 95, status: "active", platform: "QuickSight", datasets: 3 },
  { id: 2, name: "Marketing Attribution Model", owner: "James R.", team: "Marketing", lastViewed: "1 day ago", views: 128, health: 82, status: "active", platform: "QuickSight", datasets: 5 },
  { id: 3, name: "Customer Churn Analysis", owner: "Priya M.", team: "Product", lastViewed: "3 days ago", views: 89, health: 67, status: "stale", platform: "QuickSight", datasets: 2 },
  { id: 4, name: "Q1 Sales Performance", owner: "Unassigned", team: "Sales", lastViewed: "45 days ago", views: 12, health: 23, status: "stale", platform: "QuickSight", datasets: 4 },
  { id: 5, name: "Product Usage Metrics", owner: "Tom W.", team: "Product", lastViewed: "5 hours ago", views: 201, health: 91, status: "active", platform: "QuickSight", datasets: 6 },
  { id: 6, name: "Supply Chain Overview", owner: "Linda C.", team: "Operations", lastViewed: "12 days ago", views: 45, health: 54, status: "stale", platform: "QuickSight", datasets: 3 },
  { id: 7, name: "HR Headcount Report", owner: "Unassigned", team: "HR", lastViewed: "60 days ago", views: 8, health: 15, status: "stale", platform: "QuickSight", datasets: 2 },
  { id: 8, name: "Finance P&L Dashboard", owner: "Sarah K.", team: "Finance", lastViewed: "1 hour ago", views: 567, health: 98, status: "active", platform: "QuickSight", datasets: 7 },
];

function HealthBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? "text-green-400 bg-green-400/10 border-green-400/20" :
    score >= 50 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${style}`}>
      {score}/100
    </span>
  );
}

export default function DashboardsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = dashboards.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase()) ||
      d.team.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? d.status === "active" :
      filter === "stale" ? d.status === "stale" :
      filter === "unassigned" ? d.owner === "Unassigned" : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboards</h1>
          <p className="text-gray-500 text-sm mt-1">
            {dashboards.length} total · {dashboards.filter(d => d.status === "active").length} active · {dashboards.filter(d => d.status === "stale").length} stale
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20">
          <BarChart3 className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 w-72 hover:border-white/10 transition-all">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {["all", "active", "stale", "unassigned"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto text-sm text-gray-600">{filtered.length} results</div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-600 border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-6 py-4 font-medium">Dashboard</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium">Last Viewed</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium">Health</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-400/10 border border-blue-400/20 rounded-xl group-hover:bg-blue-400/15 transition-all">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-gray-600">{d.platform} · {d.datasets} datasets</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                    <span className={`text-sm ${d.owner === "Unassigned" ? "text-red-400" : "text-gray-400"}`}>
                      {d.owner}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">
                    {d.team}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-sm text-gray-500">{d.lastViewed}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{d.views}</td>
                <td className="px-6 py-4"><HealthBadge score={d.health} /></td>
                <td className="px-6 py-4">
                  {d.status === "active" ? (
                    <div className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-yellow-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-xs">stale</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}