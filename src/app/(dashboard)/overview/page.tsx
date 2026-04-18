import { BarChart3, Database, Users, Activity, AlertTriangle, CheckCircle } from "lucide-react";

const stats = [
  {
    name: "Total Dashboards",
    value: "48",
    change: "+3 this month",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    name: "Datasets",
    value: "124",
    change: "+12 this month",
    icon: Database,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    name: "Active Users",
    value: "36",
    change: "of 52 licensed",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    name: "Avg Health Score",
    value: "73",
    change: "-2 from last week",
    icon: Activity,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const alerts = [
  { type: "warning", message: "14 dashboards not viewed in 90+ days", },
  { type: "warning", message: "16 users have not logged in this month", },
  { type: "success", message: "All datasets refreshed successfully today", },
  { type: "warning", message: "3 dashboards have no assigned owner", },
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
    score >= 80 ? "text-green-400 bg-green-400/10" :
    score >= 50 ? "text-yellow-400 bg-yellow-400/10" :
    "text-red-400 bg-red-400/10";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
      status === "active"
        ? "text-green-400 bg-green-400/10"
        : "text-yellow-400 bg-yellow-400/10"
    }`}>
      {status}
    </span>
  );
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">BI Operations Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          QuickSight · Last synced 5 minutes ago
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.name}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Alerts + Recent Assets */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Alerts */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3">
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
        <div className="col-span-2 bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Recent Assets</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Last Viewed</th>
                <th className="pb-3 font-medium">Health</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentAssets.map((asset, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-3">
                    <div className="text-white font-medium">{asset.name}</div>
                    <div className="text-xs text-gray-500">{asset.type}</div>
                  </td>
                  <td className="py-3 text-gray-400">{asset.owner}</td>
                  <td className="py-3 text-gray-400">{asset.lastViewed}</td>
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
