import { BarChart3, Database, Users, Activity, AlertTriangle, CheckCircle } from "lucide-react";

const stats = [
  {
    name: "Total Dashboards",
    value: "48",
    change: "+3 this month",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  {
    name: "Datasets",
    value: "124",
    change: "+12 this month",
    icon: Database,
    color: "text-purple-400",
    bg: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
  },
  {
    name: "Active Users",
    value: "36",
    change: "of 52 licensed",
    icon: Users,
    color: "text-green-400",
    bg: "from-green-500/10 to-green-500/5",
    border: "border-green-500/20",
    glow: "shadow-green-500/10",
  },
  {
    name: "Avg Health Score",
    value: "73",
    change: "-2 from last week",
    icon: Activity,
    color: "text-orange-400",
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/10",
  },
];

const alerts = [
  { type: "warning", message: "14 dashboards not viewed in 90+ days" },
  { type: "warning", message: "16 users have not logged in this month" },
  { type: "success", message: "All datasets refreshed successfully today" },
  { type: "warning", message: "3 dashboards have no assigned owner" },
];

const recentAssets = [
  { name: "Executive Revenue Overview", type: "Dashboard", owner: "Sarah K.", lastViewed: "2 hours ago", health: 95, status: "active" },
  { name: "Marketing Attribution Model", type: "Dashboard", owner: "James R.", lastViewed: "1 day ago", health: 82, status: "active" },
  { name: "Customer Churn Analysis", type: "Dataset", owner: "Priya M.", lastViewed: "3 days ago", health: 67, status: "stale" },
  { name: "Q1 Sales Performance", type: "Dashboard", owner: "Unassigned", lastViewed: "45 days ago", health: 23, status: "stale" },
  { name: "Product Usage Metrics", type: "Dashboard", owner: "Tom W.", lastViewed: "5 hours ago", health: 91, status: "active" },
];

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-green-400 bg-green-400/10 border-green-400/20" :
    score >= 50 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
    "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
      status === "active"
        ? "text-green-400 bg-green-400/10 border-green-400/20"
        : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    }`}>
      {status}
    </span>
  );
}

export default function OverviewPage() {
  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">BI Operations Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          QuickSight · Last synced 5 minutes ago
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`relative rounded-2xl p-5 border ${stat.border} bg-gradient-to-br ${stat.bg} backdrop-blur-sm shadow-xl ${stat.glow} overflow-hidden`}
          >
            {/* Glow orb */}
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.bg} blur-xl opacity-60`} />

            <div className="relative flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.name}</span>
              <div className={`p-2 rounded-xl bg-white/[0.05] border border-white/[0.08]`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="relative text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="relative text-xs text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Alerts + Recent Assets */}
      <div className="grid grid-cols-3 gap-4">

        {/* Alerts */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                alert.type === "warning"
                  ? "bg-yellow-500/5 border-yellow-500/15"
                  : "bg-green-500/5 border-green-500/15"
              }`}>
                {alert.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                )}
                <span className="text-sm text-gray-400">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assets */}
        <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Recent Assets
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-600 border-b border-white/[0.04]">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Last Viewed</th>
                <th className="pb-3 font-medium">Health</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentAssets.map((asset, i) => (
                <tr key={i} className="text-sm hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="text-white font-medium">{asset.name}</div>
                    <div className="text-xs text-gray-600">{asset.type}</div>
                  </td>
                  <td className="py-3 text-gray-400">{asset.owner}</td>
                  <td className="py-3 text-gray-500 text-xs">{asset.lastViewed}</td>
                  <td className="py-3"><HealthBadge score={asset.health} /></td>
                  <td className="py-3"><StatusBadge status={asset.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}