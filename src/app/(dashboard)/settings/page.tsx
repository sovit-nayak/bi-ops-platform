"use client";

import { useState } from "react";
import {
  CheckCircle, XCircle, RefreshCw, Plus,
  PieChart, BarChart3, Activity, Layout, Database,
} from "lucide-react";

const platforms = [
  {
    id: 1,
    name: "Amazon QuickSight",
    icon: PieChart,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    glow: "from-orange-500/10 to-orange-500/5",
    status: "connected",
    lastSync: "5 minutes ago",
    assets: { dashboards: 48, datasets: 124, users: 52 },
    region: "us-east-1",
  },
  {
    id: 2,
    name: "Tableau",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    glow: "from-blue-500/10 to-blue-500/5",
    status: "disconnected",
    lastSync: "Never",
    assets: { dashboards: 0, datasets: 0, users: 0 },
    region: null,
  },
  {
    id: 3,
    name: "Power BI",
    icon: Activity,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    glow: "from-yellow-500/10 to-yellow-500/5",
    status: "disconnected",
    lastSync: "Never",
    assets: { dashboards: 0, datasets: 0, users: 0 },
    region: null,
  },
  {
    id: 4,
    name: "Looker",
    icon: Layout,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    glow: "from-green-500/10 to-green-500/5",
    status: "disconnected",
    lastSync: "Never",
    assets: { dashboards: 0, datasets: 0, users: 0 },
    region: null,
  },
];

const syncSettings = [
  { label: "Auto Sync", desc: "Automatically sync metadata every hour", enabled: true },
  { label: "Usage Tracking", desc: "Track dashboard views and user activity", enabled: true },
  { label: "Health Alerts", desc: "Get notified when asset health drops below 50", enabled: false },
  { label: "Stale Asset Alerts", desc: "Alert when dashboards haven't been viewed in 90 days", enabled: true },
];

export default function SettingsPage() {
  const [syncing, setSyncing] = useState(false);
  const [toggles, setToggles] = useState(syncSettings.map(s => s.enabled));

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your BI platform connections and sync preferences
        </p>
      </div>

      {/* Platform Connections */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Platform Connections
        </h2>

        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`relative rounded-2xl border backdrop-blur-sm overflow-hidden ${
              platform.status === "connected"
                ? `border-${platform.border} bg-gradient-to-br ${platform.glow}`
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            {platform.status === "connected" && (
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${platform.glow} blur-2xl opacity-50`} />
            )}

            <div className="relative flex items-center justify-between p-5">
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${platform.bg} border ${platform.border}`}>
                  <platform.icon className={`w-6 h-6 ${platform.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{platform.name}</span>
                    {platform.status === "connected" ? (
                      <div className="flex items-center gap-1 text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        <span className="text-xs">Not Connected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Last synced: {platform.lastSync}
                    {platform.region && ` · ${platform.region}`}
                  </p>
                </div>
              </div>

              {/* Right */}
              {platform.status === "connected" ? (
                <div className="flex items-center gap-6">
                  {[
                    { val: platform.assets.dashboards, label: "Dashboards" },
                    { val: platform.assets.datasets, label: "Datasets" },
                    { val: platform.assets.users, label: "Users" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-white font-bold">{stat.val}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                  <button
                    onClick={handleSync}
                    className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 text-gray-300 text-sm px-4 py-2 rounded-xl transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync Now"}
                  </button>
                </div>
              ) : (
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Settings */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Sync Settings
        </h2>
        <div className="space-y-1">
          {syncSettings.map((setting, i) => (
            <div
              key={setting.label}
              className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0"
            >
              <div>
                <div className="text-white text-sm font-medium">{setting.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{setting.desc}</div>
              </div>
              <button
                onClick={() => {
                  const next = [...toggles];
                  next[i] = !next[i];
                  setToggles(next);
                }}
                className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${
                  toggles[i] ? "bg-orange-500" : "bg-white/[0.08]"
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                  toggles[i] ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] backdrop-blur-sm p-5">
        <h2 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Reset All Data</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Clear all synced metadata and start fresh
            </div>
          </div>
          <button className="text-sm text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all">
            Reset Data
          </button>
        </div>
      </div>

    </div>
  );
}