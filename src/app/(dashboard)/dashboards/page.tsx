"use client";

import { useState } from "react";
import {
  BarChart3,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";

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
  const color =
    score >= 80 ? "text-green-400 bg-green-400/10" :
    score >= 50 ? "text-yellow-400 bg-yellow-400/10" :
    "text-red-400 bg-red-400/10";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
      {score}/100
    </span>
  );
}

function StatusIcon({ status }: { status: string }) {
  return status === "active" ? (
    <CheckCircle className="w-4 h-4 text-green-400" />
  ) : (
    <AlertTriangle className="w-4 h-4 text-yellow-400" />
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
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboards</h1>
          <p className="text-gray-400 text-sm mt-1">
            {dashboards.length} total · {dashboards.filter(d => d.status === "active").length} active · {dashboards.filter(d => d.status === "stale").length} stale
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-all">
          <BarChart3 className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-72">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {["all", "active", "stale", "unassigned"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-md capitalize transition-all ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto text-sm text-gray-500">
          {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800 bg-gray-900/50">
              <th className="px-6 py-4 font-medium">Dashboard</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium">Last Viewed</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium">Health</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((d) => (
              <tr
                key={d.id}
                className="hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-400/10 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.platform} · {d.datasets} datasets</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span className={`text-sm ${d.owner === "Unassigned" ? "text-red-400" : "text-gray-400"}`}>
                      {d.owner}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                    {d.team}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-400">{d.lastViewed}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{d.views}</td>
                <td className="px-6 py-4"><HealthBadge score={d.health} /></td>
                <td className="px-6 py-4"><StatusIcon status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
