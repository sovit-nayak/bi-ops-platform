"use client";

import { useState } from "react";
import { Users, Search, AlertTriangle, DollarSign, UserCheck, UserX } from "lucide-react";

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
    active: "text-green-400 bg-green-400/10",
    inactive: "text-yellow-400 bg-yellow-400/10",
    ghost: "text-red-400 bg-red-400/10",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status]}`}>
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
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">
          {users.length} licensed · {activeUsers.length} active · {ghostUsers.length} ghost users detected
        </p>
      </div>

      {/* License Optimization Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg mt-0.5">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">
                License Optimization Opportunity
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {ghostUsers.length} users have not logged in for 45+ days.
                Removing them could save your organization
                <span className="text-orange-400 font-semibold"> ${potentialSavings.toLocaleString()}/month</span>.
              </p>
            </div>
          </div>
          <button className="bg-orange-500 hover:bg-orange-400 text-white text-sm px-4 py-2 rounded-lg transition-all shrink-0">
            Review Ghost Users
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Licensed", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Active Users", value: activeUsers.length, icon: UserCheck, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Ghost Users", value: ghostUsers.length, icon: UserX, color: "text-red-400", bg: "bg-red-400/10" },
          { label: "Monthly Savings", value: `$${potentialSavings}`, icon: DollarSign, color: "text-orange-400", bg: "bg-orange-400/10" },
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {["all", "active", "inactive", "ghost"].map((f) => (
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
        <div className="ml-auto text-sm text-gray-500">{filtered.length} users</div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium">Last Active</th>
              <th className="px-6 py-4 font-medium">Dashboards Owned</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.team}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.lastActive}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.dashboardsOwned}</td>
                <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                <td className="px-6 py-4">
                  {u.status === "ghost" && (
                    <button className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1 rounded-lg transition-all flex items-center gap-1">
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
