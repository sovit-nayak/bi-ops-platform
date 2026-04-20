"use client";

import { useState } from "react";
import { Database, Search, Table, Cloud, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const datasets = [
  { id: 1, name: "Sales Transactions", type: "Direct Query", source: "Amazon RDS", owner: "Sarah K.", lastRefreshed: "2 hours ago", rows: "2.4M", size: "1.2 GB", dashboards: 4, status: "healthy" },
  { id: 2, name: "Marketing Campaigns", type: "SPICE", source: "S3 Bucket", owner: "James R.", lastRefreshed: "1 day ago", rows: "450K", size: "230 MB", dashboards: 3, status: "healthy" },
  { id: 3, name: "Customer Master", type: "SPICE", source: "Amazon RDS", owner: "Priya M.", lastRefreshed: "3 days ago", rows: "890K", size: "560 MB", dashboards: 6, status: "stale" },
  { id: 4, name: "Product Inventory", type: "Direct Query", source: "Redshift", owner: "Tom W.", lastRefreshed: "5 hours ago", rows: "120K", size: "45 MB", dashboards: 2, status: "healthy" },
  { id: 5, name: "Finance GL Data", type: "SPICE", source: "S3 Bucket", owner: "Unassigned", lastRefreshed: "7 days ago", rows: "3.1M", size: "2.1 GB", dashboards: 5, status: "stale" },
  { id: 6, name: "HR Headcount", type: "SPICE", source: "Workday API", owner: "Linda C.", lastRefreshed: "1 day ago", rows: "12K", size: "8 MB", dashboards: 2, status: "healthy" },
  { id: 7, name: "Web Analytics", type: "Direct Query", source: "Athena", owner: "James R.", lastRefreshed: "30 mins ago", rows: "8.2M", size: "4.5 GB", dashboards: 3, status: "healthy" },
];

function StatusBadge({ status }: { status: string }) {
  return status === "healthy" ? (
    <div className="flex items-center gap-1.5">
      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
      <span className="text-xs text-green-400">Healthy</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
      <span className="text-xs text-yellow-400">Stale</span>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
      type === "SPICE"
        ? "text-purple-400 bg-purple-400/10"
        : "text-blue-400 bg-blue-400/10"
    }`}>
      {type}
    </span>
  );
}

export default function DatasetsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = datasets.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.source.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "healthy" ? d.status === "healthy" :
      filter === "stale" ? d.status === "stale" :
      filter === "spice" ? d.type === "SPICE" :
      filter === "direct" ? d.type === "Direct Query" : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Datasets</h1>
          <p className="text-gray-400 text-sm mt-1">
            {datasets.length} total · {datasets.filter(d => d.status === "healthy").length} healthy · {datasets.filter(d => d.status === "stale").length} stale
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-lg transition-all">
          <Database className="w-4 h-4" />
          Refresh All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Datasets", value: datasets.length, icon: Database, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "SPICE Datasets", value: datasets.filter(d => d.type === "SPICE").length, icon: Cloud, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Direct Query", value: datasets.filter(d => d.type === "Direct Query").length, icon: Table, color: "text-orange-400", bg: "bg-orange-400/10" },
          { label: "Stale Datasets", value: datasets.filter(d => d.status === "stale").length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-72">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {["all", "healthy", "stale", "spice", "direct"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-md capitalize transition-all ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto text-sm text-gray-500">{filtered.length} results</div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th className="px-6 py-4 font-medium">Dataset</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Source</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Last Refreshed</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Dashboards</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-400/10 rounded-lg">
                      <Database className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.rows} rows</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><TypeBadge type={d.type} /></td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-md">{d.source}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{d.owner}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-400">{d.lastRefreshed}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{d.size}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{d.dashboards}</td>
                <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}