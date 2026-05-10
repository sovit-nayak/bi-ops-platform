"use client";

import { useState, useEffect } from "react";
import { BarChart3, Search, User, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface Dashboard {
  id: number;
  name: string;
  description: string;
  views: number;
  updatedAt: string;
  createdAt: string;
  archived: boolean;
  owner: string;
  platform: string;
}

function PlatformBadge({ platform }: { platform: string }) {
  const style =
    platform === "Metabase"   ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
    platform === "QuickSight" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
    platform === "Tableau"    ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" :
    platform === "Looker"     ? "text-green-400 bg-green-400/10 border-green-400/20" :
    platform === "Power BI"   ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-gray-400 bg-gray-400/10 border-gray-400/20";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style}`}>
      {platform}
    </span>
  );
}

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/connectors")
      .then(res => res.json())
      .then(data => {
        setDashboards(data.dashboards);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const platforms = [...new Set(dashboards.map(d => d.platform))];

  const filtered = dashboards.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? !d.archived :
      filter === "archived" ? d.archived : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboards</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Loading..." : `${dashboards.length} total · ${dashboards.filter(d => !d.archived).length} active · ${platforms.join(", ")}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {platforms.map(p => (
            <div key={p} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">{p} connected</span>
            </div>
          ))}
        </div>
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
          {["all", "active", "archived"].map((f) => (
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-600 border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-4 font-medium">Dashboard</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
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
                        <div className="text-xs text-gray-600 truncate max-w-xs">{d.description || "No description"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><PlatformBadge platform={d.platform} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-sm text-gray-400">{d.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{d.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-sm text-gray-500">
                        {new Date(d.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!d.archived ? (
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-yellow-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-xs">archived</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}