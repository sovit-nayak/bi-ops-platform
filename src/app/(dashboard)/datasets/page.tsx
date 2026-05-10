"use client";

import { useState, useEffect } from "react";
import { Database, Search, Clock, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface Dataset {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  views: number;
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

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="text-xs px-2 py-1 rounded-lg font-medium border text-purple-400 bg-purple-400/10 border-purple-400/20 capitalize">
      {type}
    </span>
  );
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchData = () => {
    setLoading(true);
    fetch("/api/connectors")
      .then(res => res.json())
      .then(data => {
        setDatasets(data.datasets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const uniqueTypes = [...new Set(datasets.map(d => d.type))];

  const filtered = datasets.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : d.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Datasets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Loading..." : `${datasets.length} total · ${uniqueTypes.length} types`}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Questions", value: datasets.length, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20" },
          { label: "Chart Types", value: uniqueTypes.length, color: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20" },
          { label: "Total Views", value: datasets.reduce((sum, d) => sum + d.views, 0), color: "text-orange-400", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20" },
          { label: "Platforms", value: [...new Set(datasets.map(d => d.platform))].length, color: "text-green-400", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20" },
        ].map((stat) => (
          <div key={stat.label} className={`relative rounded-2xl p-5 border ${stat.border} bg-gradient-to-br ${stat.bg} backdrop-blur-sm overflow-hidden`}>
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.bg} blur-xl opacity-60`} />
            <div className="relative text-gray-400 text-sm mb-2">{stat.label}</div>
            <div className={`relative text-3xl font-bold ${stat.color}`}>
              {loading ? "—" : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 w-72 hover:border-white/10 transition-all">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
              filter === "all"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-500 hover:text-white"
            }`}
          >
            all
          </button>
          {uniqueTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === t
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {t}
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
                <th className="px-6 py-4 font-medium">Question</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-400/10 border border-purple-400/20 rounded-xl group-hover:bg-purple-400/15 transition-all">
                        <Database className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-white text-sm font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><TypeBadge type={d.type} /></td>
                  <td className="px-6 py-4"><PlatformBadge platform={d.platform} /></td>
                  <td className="px-6 py-4 text-sm text-gray-400">{d.owner}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{d.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-sm text-gray-500">
                        {new Date(d.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
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