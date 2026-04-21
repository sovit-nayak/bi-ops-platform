"use client";

import { useState } from "react";
import { Users, Search, DollarSign, UserCheck, UserX, AlertTriangle } from "lucide-react";

const users = [
  { id: 1, name: "Sarah K.", email: "sarah.k@company.com", role: "Author", team: "Finance", lastActive: "2 hours ago", dashboardsOwned: 4, status: "active", licensed: true },
  { id: 2, name: "James R.", email: "james.r@company.com", role: "Author", team: "Marketing", lastActive: "1 day ago", dashboardsOwned: 3, status: "active", licensed: true },
  { id: 3, name: "Priya M.", email: "priya.m@company.com", role: "Reader", team: "Product", lastActive: "3 days ago", dashboardsOwned: 1, status: "active", licensed: true },
  { id: 4, name: "Tom W.", email: "tom.w@company.com", role: "Author", team: "Product", lastActive: "5 hours ago", dashboardsOwned: 5, status: "active", licensed: true },
  { id: 5, name: "Linda C.", email: "linda.c@company.com", role: "Reader", team: "Operations", lastActive: "12 days ago", dashboardsOwned: 0, status: "inactive", licensed: true },
  { id: 6, name: "Mark T.", email: "mark.t@company.com", role: "Reader", team: "Sales", lastActive: "45 days ago", dashboardsOwned: 0, status: "ghost", licensed: true },
  { id: 7, name: "Anna B.", email: "anna.b@company.com", role: "Reader", team: "HR", lastActive: "60 days ago", dashboardsOwned: 0, status: "ghost", licensed: true },
  { id: 8, name: "Chris P.", email: "chris.p@company.com", role: "Reader", team: "Finance", lastActive: "90+ days ago", dashboardsOwned: 0, status: "ghost", licensed: true },
  { id: 9, name: "David L.", email: "david.l@company.com", role: "Author", team: "Engineering", lastActive: "Never", dashboardsOwned: 0, status: "ghost", licensed: true },
  { id: 10, name: "Emma S.", email: "emma.s@company.com", role: "Reader", team: "Marketing", lastActive: "1 hour ago", dashboardsOwned: 0, status: "active", licensed: true },
];

const LICENSE_COST = 85;

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "text-green-400 bg-green-400/10 border-green-400/20",
    inactive: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    ghost: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const ghostUsers = users.filter(u => u.status === "ghost");
  const activeUsers = users.filter(u => u.status === "active");
  const potentialSavings = ghostUsers.length * LICENSE_COST;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.team.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? u.status === "active" :
      filter === "ghost" ? u.status === "ghost" :
      filter === "inactive" ? u.status === "inactive" : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 min-h-screen bg-[#050505] p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
        <p className="text-gray-500 text-sm mt-1">
          {users.length} licensed · {activeUsers.length} active · {ghostUsers.length} ghost users detected
        </p>
      </div>

      {/* License Optimization Banner */}
      <div className="relative rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm p-5 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-orange-500/20 border border-orange-500/30 rounded-xl mt-0.5">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">License Optimization Opportunity</h3>
              <p className="text-gray-400 text-sm mt-1">
                {ghostUsers.length} users have not logged in for 45+ days. Removing them could save
                <span className="text-orange-400 font-semibold"> ${potentialSavings.toLocaleString()}/month</span>.
              </p>
            </div>
          </div>
          <button className="bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20 shrink-0">
            Review Ghost Users
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Licensed", value: users.length, icon: Users, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20" },
          { label: "Active Users", value: activeUsers.length, icon: UserCheck, color: "text-green-400", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20" },
          { label: "Ghost Users", value: ghostUsers.length, icon: UserX, color: "text-red-400", bg: "from-red-500/10 to-red-500/5", border: "border-red-500/20" },
          { label: "Monthly Savings", value: `$${potentialSavings}`, icon: DollarSign, color: "text-orange-400", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20" },
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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 w-72 hover:border-white/10 transition-all">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {["all", "active", "inactive", "ghost"].map((f) => (
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
        <div className="ml-auto text-sm text-gray-600">{filtered.length} users</div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-600 border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium">Last Active</th>
              <th className="px-6 py-4 font-medium">Dashboards</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((u) => (
              <tr key={u.id} className={`hover:bg-white/[0.03] transition-colors ${u.status === "ghost" ? "bg-red-500/[0.02]" : ""}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                      u.status === "ghost"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-orange-500/20 border-orange-500/20 text-orange-400"
                    }`}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.team}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{u.lastActive}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.dashboardsOwned}</td>
                <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                <td className="px-6 py-4">
                  {u.status === "ghost" && (
                    <button className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 px-3 py-1 rounded-xl transition-all flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Remove License
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}