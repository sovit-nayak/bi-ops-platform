"use client";

import { useState } from "react";
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Plus,
  Zap,
  BarChart3,
  Layout,
  PieChart,
  Activity
} from "lucide-react";

const platforms = [
  {
    id: 1,
    name: "Amazon QuickSight",
    icon: PieChart,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
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
    status: "disconnected",
    lastSync: "Never",
    assets: { dashboards: 0, datasets: 0, users: 0 },
    region: null,
  },
];

export default function SettingsPage() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your BI platform connections
        </p>
      </div>

      {/* Connected Platforms */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold">Platform Connections</h2>

        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              
              {/* Left — icon + name + status */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${platform.bg}`}>
                  <platform.icon className={`w-6 h-6 ${platform.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{platform.name}</span>
                    {platform.status === "connected" ? (
                      <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
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

              {/* Right — stats or connect button */}
              {platform.status === "connected" ? (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-white font-bold">{platform.assets.dashboards}</div>
                    <div className="text-xs text-gray-500">Dashboards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{platform.assets.datasets}</div>
                    <div className="text-xs text-gray-500">Datasets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{platform.assets.users}</div>
                    <div className="text-xs text-gray-500">Users</div>
                  </div>
                  <button
                    onClick={handleSync}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync Now"}
                  </button>
                </div>
              ) : (
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Settings */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-white font-semibold mb-4">Sync Settings</h2>
        <div className="space-y-4">
          {[
            { label: "Auto Sync", desc: "Automatically sync metadata every hour", enabled: true },
            { label: "Usage Tracking", desc: "Track dashboard views and user activity", enabled: true },
            { label: "Health Alerts", desc: "Get notified when asset health drops below 50", enabled: false },
            { label: "Stale Asset Alerts", desc: "Alert when dashboards haven't been viewed in 90 days", enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div>
                <div className="text-white text-sm font-medium">{setting.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{setting.desc}</div>
              </div>
              <div className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${
                setting.enabled ? "bg-orange-500" : "bg-gray-700"
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                  setting.enabled ? "translate-x-4" : "translate-x-0"
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-900 rounded-xl p-6 border border-red-900/50">
        <h2 className="text-red-400 font-semibold mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Reset All Data</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Clear all synced metadata and start fresh
            </div>
          </div>
          <button className="text-sm text-red-400 border border-red-900 hover:bg-red-900/20 px-4 py-2 rounded-lg transition-all">
            Reset Data
          </button>
        </div>
      </div>

    </div>
  );
}