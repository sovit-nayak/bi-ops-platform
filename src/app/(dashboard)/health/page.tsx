"use client";

import { useState } from "react";
import { Activity, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Database, Users } from "lucide-react";

const assets = [
  { id: 1, name: "Executive Revenue Overview", type: "Dashboard", owner: "Sarah K.", health: 95, lastViewed: "2 hours ago", viewCount: 342, hasOwner: true, dataFresh: true, activeUsers: 12 },
  { id: 2, name: "Marketing Attribution", type: "Dashboard", owner: "James R.", health: 82, lastViewed: "1 day ago", viewCount: 128, hasOwner: true, dataFresh: true, activeUsers: 8 },
  { id: 3, name: "Customer Master", type: "Dataset", owner: "Priya M.", health: 67, lastViewed: "3 days ago", viewCount: 89, hasOwner: true, dataFresh: false, activeUsers: 5 },
  { id: 4, name: "Q1 Sales Performance", type: "Dashboard", owner: "Unassigned", health: 23, lastViewed: "45 days ago", viewCount: 12, hasOwner: false, dataFresh: false, activeUsers: 0 },
  { id: 5, name: "Product Usage Metrics", type: "Dashboard", owner: "Tom W.", health: 91, lastViewed: "5 hours ago", viewCount: 201, hasOwner: true, dataFresh: true, activeUsers: 15 },
  { id: 6, name: "Finance GL Data", type: "Dataset", owner: "Unassigned", health: 34, lastViewed: "7 days ago", viewCount: 23, hasOwner: false, dataFresh: false, activeUsers: 2 },
  { id: 7, name: "HR Headcount Report", type: "Dashboard", owner: "Linda C.", health: 15, lastViewed: "60 days ago", viewCount: 8, hasOwner: true, dataFresh: false, activeUsers: 0 },
  { id: 8, name: "Finance P&L", type: "Dashboard", owner: "Sarah K.", health: 98, lastViewed: "1 hour ago", viewCount: 567, hasOwner: true, dataFresh: true, activeUsers: 20 },
];

function HealthBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-500" :
    score >= 50 ? "bg-yellow-500" :
    "bg-red-500";
  const textColor =
    score >= 80 ? "text-green-400" :
    score >= 50 ? "text-yellow-400" :
    "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-white/[0.06] rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-medium w-8 text-right ${textColor}`}>{score}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const label = score >= 80 ? "Healthy" : score >= 50 ? "At Risk" : "Critical";
  const style =
    score >= 80 ? "text-green-400 bg-green-400/10 border-green-400/20" :
    score >= 50 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${style}`}>
      {label}
    </span>
  );
}

export default function HealthPage() {
  const [filter, setFilter] = useState("all");

  const healthy = assets.filter(a => a.health >= 80);
  const atRisk = assets.filter(a => a.health >= 50 && a.health < 80);
  const critical = assets.filter(a => a.health < 50);
  const avgHealth = Math.round(assets.reduce((sum, a) => sum + a.health, 0) / assets.length);

  const filtered = assets.filter(a =>
    filter === "all" ? true :
    filter === "healthy" ? a.health >= 80 :
    filter === "at risk" ? a.health >= 50 && a.health < 80 :
    filter === "critical" ? a.health < 50 : true
  ).sort((a, b) => a.health - b.health);

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Health Scores</h1>
        <p className="text-gray-500 text-sm mt-1">
          Asset health based on usage, ownership, and data freshness
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Health Score", value: avgHealth, icon: Activity, color: "text-orange-400", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20" },
          { label: "Healthy", value: healthy.length, icon: CheckCircle, color: "text-green-400", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20" },
          { label: "At Risk", value: atRisk.length, icon: TrendingDown, color: "text-yellow-400", bg: "from-yellow-500/10 to-yellow-500/5", border: "border-yellow-500/20" },
          { label: "Critical", value: critical.length, icon: AlertTriangle, color: "text-red-400", bg: "from-red-500/10 to-red-500/5", border: "border-red-500/20" },
        ].map((stat) => (
          <div key={stat.label} className={`relative rounded-2xl p-5 border ${stat.border} bg-gradient-to-br ${stat.bg} backdrop-blur-sm overflow-hidden`}>
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.bg} blur-xl opacity-60`} />
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="relative text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* How score is calculated */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          How Health Score Is Calculated
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Usage", desc: "Views in last 30 days, active users", weight: "40%", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
            { label: "Ownership", desc: "Has assigned owner, owner is active", weight: "30%", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
            { label: "Data Freshness", desc: "Dataset refreshed within SLA", weight: "30%", icon: Database, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
          ].map((factor) => (
            <div key={factor.label} className={`flex items-start gap-3 p-4 bg-white/[0.02] border ${factor.border} rounded-xl`}>
              <div className={`p-2 rounded-xl ${factor.bg} border ${factor.border} shrink-0`}>
                <factor.icon className={`w-4 h-4 ${factor.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{factor.label}</span>
                  <span className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
                    {factor.weight}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {["all", "healthy", "at risk", "critical"].map((f) => (
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
        <span className="text-sm text-gray-600 ml-auto">{filtered.length} assets</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-600 border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Last Viewed</th>
              <th className="px-6 py-4 font-medium">Active Users</th>
              <th className="px-6 py-4 font-medium w-48">Health Score</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      a.type === "Dashboard"
                        ? "bg-blue-400/10 border-blue-400/20"
                        : "bg-purple-400/10 border-purple-400/20"
                    }`}>
                      {a.type === "Dashboard"
                        ? <BarChart3 className="w-4 h-4 text-blue-400" />
                        : <Database className="w-4 h-4 text-purple-400" />
                      }
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-gray-600">{a.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${a.owner === "Unassigned" ? "text-red-400" : "text-gray-400"}`}>
                    {a.owner}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{a.lastViewed}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{a.activeUsers}</td>
                <td className="px-6 py-4 w-48"><HealthBar score={a.health} /></td>
                <td className="px-6 py-4"><ScoreBadge score={a.health} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}