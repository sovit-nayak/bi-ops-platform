"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle, XCircle, RefreshCw, Plus, Eye, EyeOff,
  PieChart, BarChart3, Activity, Layout, Database,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PLATFORMS = [
  { id: "metabase", name: "Metabase", icon: Database, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", glow: "from-blue-500/10 to-blue-500/5", urlLabel: "Metabase URL", urlPlaceholder: "http://localhost:3001" },
  { id: "quicksight", name: "QuickSight", icon: PieChart, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", glow: "from-orange-500/10 to-orange-500/5", urlLabel: "AWS Account ID", urlPlaceholder: "123456789012" },
  { id: "tableau", name: "Tableau", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", glow: "from-blue-500/10 to-blue-500/5", urlLabel: "Tableau Server URL", urlPlaceholder: "https://tableau.yourcompany.com" },
  { id: "looker", name: "Looker", icon: Layout, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", glow: "from-green-500/10 to-green-500/5", urlLabel: "Looker URL", urlPlaceholder: "https://yourcompany.looker.com" },
  { id: "powerbi", name: "Power BI", icon: Activity, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", glow: "from-yellow-500/10 to-yellow-500/5", urlLabel: "Tenant ID", urlPlaceholder: "your-tenant-id" },
];

const syncSettings = [
  { label: "Auto Sync", desc: "Automatically sync metadata every hour", enabled: true },
  { label: "Usage Tracking", desc: "Track dashboard views and user activity", enabled: true },
  { label: "Health Alerts", desc: "Get notified when asset health drops below 50", enabled: false },
  { label: "Stale Asset Alerts", desc: "Alert when dashboards haven't been viewed in 90 days", enabled: true },
];

interface Connection {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
}

interface ConnectFormProps {
  platform: typeof PLATFORMS[0];
  onConnected: () => void;
  onCancel: () => void;
}

function ConnectForm({ platform, onConnected, onCancel }: ConnectFormProps) {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleConnect = async () => {
    if (!url || !apiKey) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("platform_connections")
      .insert({
        user_id: user.id,
        platform: platform.id,
        url,
        api_key: apiKey,
        is_active: true,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onConnected();
  };

  return (
    <div className="mt-4 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl space-y-3">
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">{platform.urlLabel}</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={platform.urlPlaceholder}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/40 transition-all"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1.5 block">API Key</label>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-orange-500/40 transition-all">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="••••••••••••••••"
            className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
          />
          <button onClick={() => setShowKey(!showKey)} className="text-gray-600 hover:text-gray-400">
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-xl transition-all"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "Connecting..." : "Connect"}
        </button>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-white transition-colors px-3 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [expandedForm, setExpandedForm] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toggles, setToggles] = useState(syncSettings.map(s => s.enabled));
  const supabase = createClient();

  const loadConnections = async () => {
    const { data } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("is_active", true);
    setConnections(data || []);
  };

  useEffect(() => { loadConnections(); }, []);

  const handleDisconnect = async (id: string) => {
    await supabase
      .from("platform_connections")
      .update({ is_active: false })
      .eq("id", id);
    loadConnections();
  };

  const isConnected = (platformId: string) =>
    connections.some(c => c.platform === platformId);

  const getConnection = (platformId: string) =>
    connections.find(c => c.platform === platformId);

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your BI platform connections
        </p>
      </div>

      {/* Platform Connections */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Platform Connections
        </h2>

        {PLATFORMS.map((platform) => {
          const connected = isConnected(platform.id);
          const connection = getConnection(platform.id);
          const showForm = expandedForm === platform.id;

          return (
            <div
              key={platform.id}
              className={`relative rounded-2xl border backdrop-blur-sm overflow-hidden ${
                connected
                  ? `bg-gradient-to-br ${platform.glow} ${platform.border}`
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <div className="relative flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${platform.bg} border ${platform.border}`}>
                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{platform.name}</span>
                      {connected ? (
                        <div className="flex items-center gap-1 text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span className="text-xs">Not connected</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {connected ? connection?.url : "Click Connect to add credentials"}
                    </p>
                  </div>
                </div>

                {connected ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000); }}
                      className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-gray-300 text-sm px-4 py-2 rounded-xl transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                      Sync
                    </button>
                    <button
                      onClick={() => handleDisconnect(connection!.id)}
                      className="text-sm text-red-400 hover:text-red-300 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-xl transition-all"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setExpandedForm(showForm ? null : platform.id)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Connect
                  </button>
                )}
              </div>

              {showForm && !connected && (
                <div className="px-5 pb-5">
                  <ConnectForm
                    platform={platform}
                    onConnected={() => { loadConnections(); setExpandedForm(null); }}
                    onCancel={() => setExpandedForm(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sync Settings */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Sync Settings
        </h2>
        <div className="space-y-1">
          {syncSettings.map((setting, i) => (
            <div key={setting.label} className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0">
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
                className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${toggles[i] ? "bg-orange-500" : "bg-white/[0.08]"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${toggles[i] ? "translate-x-4" : "translate-x-0"}`} />
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
            <div className="text-white text-sm font-medium">Reset All Connections</div>
            <div className="text-xs text-gray-500 mt-0.5">Disconnect all platforms and clear synced data</div>
          </div>
          <button className="text-sm text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all">
            Reset
          </button>
        </div>
      </div>

    </div>
  );
}