"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer, XAxis,
} from "recharts";
import {
  BarChart3, Database, Users, Activity, ArrowRight,
  CheckCircle, Zap, Shield, RefreshCw, PieChart as PieIcon,
  Layout, AlertTriangle, TrendingUp, TrendingDown,
} from "lucide-react";

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function Counter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      onUpdate: v => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to, duration]);
  return <>{val}</>;
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const areaData = [
  { month: "Oct", views: 320 }, { month: "Nov", views: 480 },
  { month: "Dec", views: 380 }, { month: "Jan", views: 620 },
  { month: "Feb", views: 540 }, { month: "Mar", views: 780 },
  { month: "Apr", views: 920 },
];

const barData = [
  { name: "Mon", value: 42 }, { name: "Tue", value: 67 },
  { name: "Wed", value: 55 }, { name: "Thu", value: 81 },
  { name: "Fri", value: 73 }, { name: "Sat", value: 31 },
  { name: "Sun", value: 28 },
];

const donutData = [
  { name: "Healthy", value: 62, color: "#22c55e" },
  { name: "At Risk", value: 24, color: "#f97316" },
  { name: "Critical", value: 14, color: "#ef4444" },
];

const sparklineData = [
  [12, 18, 14, 22, 19, 28, 24, 32],
  [8, 12, 9, 15, 11, 18, 14, 20],
  [20, 15, 22, 18, 25, 21, 28, 24],
  [5, 8, 6, 11, 9, 14, 11, 17],
];

const tableRows = [
  { name: "Revenue Overview", owner: "Sarah K.", health: 95, trend: "up", views: 342 },
  { name: "Marketing Model", owner: "James R.", health: 82, trend: "up", views: 128 },
  { name: "Churn Analysis", owner: "Priya M.", health: 67, trend: "down", views: 89 },
  { name: "Q1 Sales", owner: "Unassigned", health: 23, trend: "down", views: 12 },
];

const datasetViewRows = [
  { name: "revenue_fact", source: "S3", refreshed: "2h ago", rows: "4.2M", fresh: true },
  { name: "marketing_events", source: "Firehose", refreshed: "6h ago", rows: "891K", fresh: true },
  { name: "churn_predictions", source: "ML Pipeline", refreshed: "3d ago", rows: "12K", fresh: false },
  { name: "user_segments", source: "dbt", refreshed: "5m ago", rows: "245K", fresh: true },
];

const userViewRows = [
  { name: "Sarah K.", lastActive: "Today", boards: 12, ghost: false },
  { name: "James R.", lastActive: "Yesterday", boards: 8, ghost: false },
  { name: "Priya M.", lastActive: "3d ago", boards: 5, ghost: false },
  { name: "tom.b@acme.com", lastActive: "47d ago", boards: 0, ghost: true },
  { name: "alice.m@acme.com", lastActive: "62d ago", boards: 0, ghost: true },
];

const healthCategories = [
  { label: "Freshness", score: 81, color: "bg-green-500" },
  { label: "Ownership", score: 54, color: "bg-yellow-500" },
  { label: "Usage", score: 67, color: "bg-blue-400" },
  { label: "Documentation", score: 42, color: "bg-orange-500" },
];

const navHeaders = [
  { title: "BI Operations Overview", sub: "QuickSight · syncing live", dot: "bg-green-400" },
  { title: "Dashboard Inventory", sub: "48 dashboards tracked", dot: "bg-blue-400" },
  { title: "Dataset Catalog", sub: "124 datasets · 3 sources", dot: "bg-purple-400" },
  { title: "User Management", sub: "52 licensed seats", dot: "bg-orange-400" },
  { title: "Health Overview", sub: "Last scan: 2h ago", dot: "bg-yellow-400" },
];

function CinematicDashboard() {
  const [activeNav, setActiveNav] = useState(0);

  // Overview
  const [kpiVisible, setKpiVisible] = useState(false);
  const [areaVisible, setAreaVisible] = useState(false);
  const [donutVisible, setDonutVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [chartBars, setChartBars] = useState([0, 0, 0, 0, 0, 0, 0]);

  // Dashboards
  const [visibleDashRows, setVisibleDashRows] = useState(0);

  // Datasets
  const [visibleDatasetRows, setVisibleDatasetRows] = useState(0);

  // Users
  const [licenseVisible, setLicenseVisible] = useState(false);
  const [visibleUserRows, setVisibleUserRows] = useState(0);

  // Health
  const [visibleHealthBars, setVisibleHealthBars] = useState(0);
  const [issuesVisible, setIssuesVisible] = useState(false);

  const navItems = ["Overview", "Dashboards", "Datasets", "Users", "Health"];

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        // Full reset
        setActiveNav(0);
        setKpiVisible(false); setAreaVisible(false); setDonutVisible(false);
        setTableVisible(false); setVisibleRows(0); setAlertVisible(false);
        setChartBars([0, 0, 0, 0, 0, 0, 0]);
        setVisibleDashRows(0); setVisibleDatasetRows(0);
        setLicenseVisible(false); setVisibleUserRows(0);
        setVisibleHealthBars(0); setIssuesVisible(false);

        await sleep(400);

        // === OVERVIEW ===
        setKpiVisible(true);
        await sleep(1200);
        setAreaVisible(true);
        await sleep(700);
        for (let i = 0; i < barData.length; i++) {
          if (cancelled) return;
          setChartBars(prev => { const n = [...prev]; n[i] = barData[i].value; return n; });
          await sleep(160);
        }
        setDonutVisible(true);
        await sleep(500);
        setAlertVisible(true);
        await sleep(400);
        setTableVisible(true);
        for (let i = 0; i < tableRows.length; i++) {
          if (cancelled) return;
          setVisibleRows(i + 1);
          await sleep(320);
        }
        await sleep(1400);

        // === DASHBOARDS ===
        setActiveNav(1);
        await sleep(500);
        for (let i = 0; i < tableRows.length; i++) {
          if (cancelled) return;
          setVisibleDashRows(i + 1);
          await sleep(380);
        }
        await sleep(1200);

        // === DATASETS ===
        setActiveNav(2);
        await sleep(500);
        for (let i = 0; i < datasetViewRows.length; i++) {
          if (cancelled) return;
          setVisibleDatasetRows(i + 1);
          await sleep(380);
        }
        await sleep(1200);

        // === USERS ===
        setActiveNav(3);
        await sleep(400);
        setLicenseVisible(true);
        await sleep(700);
        for (let i = 0; i < userViewRows.length; i++) {
          if (cancelled) return;
          setVisibleUserRows(i + 1);
          await sleep(320);
        }
        await sleep(1200);

        // === HEALTH ===
        setActiveNav(4);
        await sleep(400);
        for (let i = 0; i < healthCategories.length; i++) {
          if (cancelled) return;
          setVisibleHealthBars(i + 1);
          await sleep(450);
        }
        setIssuesVisible(true);
        await sleep(1600);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-5xl mx-auto mt-16"
    >
      <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-orange-500/20 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(249,115,22,0.08)]"
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-black/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-4 bg-white/5 rounded-md h-5 flex items-center px-3">
            <span className="text-[10px] text-gray-600">helm-bi.vercel.app/overview</span>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-[10px] text-orange-400 font-medium">Live</span>
          </motion.div>
        </div>

        {/* Body */}
        <div className="flex" style={{ height: "460px" }}>

          {/* Sidebar */}
          <div className="w-44 border-r border-white/[0.05] p-3 space-y-0.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 mb-3">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Helm</span>
            </div>
            {navItems.map((item, i) => (
              <motion.div
                key={item}
                animate={{
                  backgroundColor: activeNav === i ? "rgba(249,115,22,0.15)" : "rgba(0,0,0,0)",
                  borderColor: activeNav === i ? "rgba(249,115,22,0.3)" : "rgba(0,0,0,0)",
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border cursor-default"
              >
                <div className={`w-2.5 h-2.5 rounded-sm ${activeNav === i ? "bg-orange-400" : "bg-white/10"}`} />
                <span className={activeNav === i ? "text-orange-300 font-medium" : "text-gray-600"}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">

            {/* Dynamic Header */}
            <div className="flex items-center justify-between shrink-0">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNav}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white font-semibold text-sm">{navHeaders[activeNav].title}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-1.5 h-1.5 rounded-full ${navHeaders[activeNav].dot}`}
                      />
                      <span className="text-[10px] text-gray-500">{navHeaders[activeNav].sub}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-gray-500 shrink-0">
                Last 30 days
              </div>
            </div>

            {/* Per-nav content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-3 flex-1 overflow-hidden"
              >

                {/* ── OVERVIEW ── */}
                {activeNav === 0 && <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Dashboards", value: 48, change: "+3", color: "text-blue-400", bg: "bg-blue-500/8", border: "border-blue-500/15", spark: sparklineData[0] },
                      { label: "Datasets", value: 124, change: "+12", color: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/15", spark: sparklineData[1] },
                      { label: "Active Users", value: 36, change: "-2", color: "text-green-400", bg: "bg-green-500/8", border: "border-green-500/15", spark: sparklineData[2] },
                      { label: "Health Score", value: 73, change: "+5", color: "text-orange-400", bg: "bg-orange-500/8", border: "border-orange-500/15", spark: sparklineData[3] },
                    ].map((kpi, i) => (
                      <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: kpiVisible ? 1 : 0, y: kpiVisible ? 0 : 12 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        className={`${kpi.bg} border ${kpi.border} rounded-xl p-2.5`}
                      >
                        <div className="text-gray-500 text-[9px] mb-1">{kpi.label}</div>
                        <div className={`text-lg font-bold ${kpi.color}`}>
                          {kpiVisible ? <Counter to={kpi.value} /> : 0}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[9px] ${kpi.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                            {kpi.change} this month
                          </span>
                          <ResponsiveContainer width={40} height={16}>
                            <LineChart data={kpi.spark.map((v, idx) => ({ v, idx }))}>
                              <Line type="monotone" dataKey="v" stroke={kpi.change.startsWith("+") ? "#22c55e" : "#ef4444"} strokeWidth={1} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: areaVisible ? 1 : 0 }}
                      transition={{ duration: 0.8 }}
                      className="col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3"
                    >
                      <div className="text-[10px] text-gray-500 mb-2 font-medium">Dashboard Views — 7 months</div>
                      <ResponsiveContainer width="100%" height={75}>
                        <AreaChart data={areaData}>
                          <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#4b5563" }} axisLine={false} tickLine={false} />
                          <Area type="monotone" dataKey="views" stroke="#f97316" strokeWidth={1.5} fill="url(#areaGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: donutVisible ? 1 : 0, scale: donutVisible ? 1 : 0.8 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-center"
                    >
                      <div className="text-[10px] text-gray-500 mb-1 font-medium">Health Split</div>
                      <ResponsiveContainer width="100%" height={65}>
                        <PieChart>
                          <Pie data={donutData} cx="50%" cy="50%" innerRadius={18} outerRadius={30} dataKey="value" strokeWidth={0}>
                            {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex gap-2">
                        {donutData.map(d => (
                          <div key={d.name} className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-[8px] text-gray-500">{d.value}%</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
                      <div className="text-[10px] text-gray-500 mb-2 font-medium">Views by Day</div>
                      <div className="flex items-end gap-1" style={{ height: "60px" }}>
                        {chartBars.map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "60px" }}>
                            <motion.div
                              animate={{ height: val > 0 ? `${val}%` : "2px" }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="w-full rounded-sm"
                              style={{ backgroundColor: val > 0 ? "rgba(249,115,22,0.7)" : "rgba(255,255,255,0.05)", minHeight: "2px" }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        {barData.map(d => <span key={d.name} className="text-[7px] text-gray-600">{d.name}</span>)}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: tableVisible ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: alertVisible ? 1 : 0, y: alertVisible ? 0 : -8 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/8 border-b border-yellow-500/15"
                      >
                        <AlertTriangle className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
                        <span className="text-[9px] text-yellow-400">16 ghost users — $1,360/mo recoverable</span>
                      </motion.div>
                      <div className="grid grid-cols-4 px-3 py-1.5 border-b border-white/[0.04]">
                        {["Name", "Owner", "Health", "Trend"].map(h => (
                          <span key={h} className="text-[8px] text-gray-600 font-medium uppercase tracking-wide">{h}</span>
                        ))}
                      </div>
                      {tableRows.slice(0, visibleRows).map((row) => (
                        <motion.div
                          key={row.name}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-4 px-3 py-1.5 border-b border-white/[0.04] last:border-0"
                        >
                          <span className="text-white text-[10px] font-medium truncate pr-2">{row.name}</span>
                          <span className={`text-[10px] ${row.owner === "Unassigned" ? "text-red-400" : "text-gray-500"}`}>{row.owner}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 bg-gray-800 rounded-full h-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${row.health}%` }}
                                transition={{ duration: 0.6 }}
                                className={`h-1 rounded-full ${row.health >= 80 ? "bg-green-500" : row.health >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                              />
                            </div>
                            <span className="text-[9px] text-gray-500">{row.health}</span>
                          </div>
                          <div className="flex items-center">
                            {row.trend === "up" ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </>}

                {/* ── DASHBOARDS ── */}
                {activeNav === 1 && <>
                  <div className="flex items-center gap-2">
                    {[["48", "Total", "text-blue-400 bg-blue-500/10 border-blue-500/20"], ["12", "Stale", "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"], ["4", "Unowned", "text-red-400 bg-red-500/10 border-red-500/20"]].map(([val, label, cls]) => (
                      <div key={label} className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-[10px] font-medium ${cls}`}>
                        <span className="font-bold">{val}</span>
                        <span className="opacity-70">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden flex-1">
                    <div className="grid grid-cols-5 px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                      {["Name", "Views", "Owner", "Health", "Trend"].map(h => (
                        <span key={h} className="text-[8px] text-gray-600 font-medium uppercase tracking-wide">{h}</span>
                      ))}
                    </div>
                    {tableRows.slice(0, visibleDashRows).map((row) => (
                      <motion.div
                        key={row.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-5 px-3 py-2.5 border-b border-white/[0.04] last:border-0 items-center"
                      >
                        <span className="text-white text-[10px] font-medium truncate pr-2">{row.name}</span>
                        <div className="flex items-center gap-1.5 pr-2">
                          <div className="flex-1 bg-gray-800 rounded-full h-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(row.views / 4, 100)}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-1 rounded-full bg-blue-400/70"
                            />
                          </div>
                          <span className="text-[9px] text-gray-500 shrink-0">{row.views}</span>
                        </div>
                        <span className={`text-[10px] ${row.owner === "Unassigned" ? "text-red-400" : "text-gray-500"}`}>{row.owner}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 bg-gray-800 rounded-full h-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${row.health}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-1 rounded-full ${row.health >= 80 ? "bg-green-500" : row.health >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            />
                          </div>
                          <span className="text-[9px] text-gray-500">{row.health}</span>
                        </div>
                        <div className="flex items-center">
                          {row.trend === "up" ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>}

                {/* ── DATASETS ── */}
                {activeNav === 2 && <>
                  <div className="flex items-center gap-2">
                    {[["S3", "bg-orange-500/10 border-orange-500/20 text-orange-400"], ["Firehose", "bg-blue-500/10 border-blue-500/20 text-blue-400"], ["dbt", "bg-green-500/10 border-green-500/20 text-green-400"], ["ML Pipeline", "bg-purple-500/10 border-purple-500/20 text-purple-400"]].map(([src, cls]) => (
                      <div key={src} className={`border rounded-lg px-2.5 py-1 text-[9px] font-medium ${cls}`}>{src}</div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden flex-1">
                    <div className="grid grid-cols-5 px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                      {["Dataset", "Source", "Refreshed", "Rows", "Status"].map(h => (
                        <span key={h} className="text-[8px] text-gray-600 font-medium uppercase tracking-wide">{h}</span>
                      ))}
                    </div>
                    {datasetViewRows.slice(0, visibleDatasetRows).map((row) => (
                      <motion.div
                        key={row.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-5 px-3 py-2.5 border-b border-white/[0.04] last:border-0 items-center"
                      >
                        <span className="text-white text-[10px] font-mono font-medium truncate pr-2">{row.name}</span>
                        <span className="text-[10px] text-gray-500">{row.source}</span>
                        <span className="text-[10px] text-gray-500">{row.refreshed}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{row.rows}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium w-fit ${row.fresh ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20"}`}>
                          {row.fresh ? "Fresh" : "Stale"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>}

                {/* ── USERS ── */}
                {activeNav === 3 && <>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: licenseVisible ? 1 : 0, y: licenseVisible ? 0 : 6 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500 font-medium">License Utilization</span>
                      <span className="text-[10px] text-orange-400 font-medium">16 ghost users · $1,360/mo recoverable</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: licenseVisible ? "69%" : "0%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-gray-600">36 active</span>
                      <span className="text-[9px] text-gray-600">52 total seats</span>
                    </div>
                  </motion.div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden flex-1">
                    <div className="grid grid-cols-4 px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                      {["User", "Last Active", "Dashboards", "Status"].map(h => (
                        <span key={h} className="text-[8px] text-gray-600 font-medium uppercase tracking-wide">{h}</span>
                      ))}
                    </div>
                    {userViewRows.slice(0, visibleUserRows).map((row) => (
                      <motion.div
                        key={row.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`grid grid-cols-4 px-3 py-2 border-b border-white/[0.04] last:border-0 items-center ${row.ghost ? "bg-red-500/[0.03]" : ""}`}
                      >
                        <div className="flex items-center gap-2 pr-2 min-w-0">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${row.ghost ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                            {row.name[0].toUpperCase()}
                          </div>
                          <span className={`text-[10px] truncate ${row.ghost ? "text-red-400" : "text-white"}`}>{row.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{row.lastActive}</span>
                        <span className="text-[10px] text-gray-500">{row.boards}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium w-fit ${row.ghost ? "text-red-400 bg-red-500/10 border border-red-500/20" : "text-green-400 bg-green-500/10 border border-green-500/20"}`}>
                          {row.ghost ? "Ghost" : "Active"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>}

                {/* ── HEALTH ── */}
                {activeNav === 4 && <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold text-orange-400">73</div>
                      <div className="text-[9px] text-gray-500 mt-1">Overall Score</div>
                      <div className="text-[9px] text-yellow-400 mt-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">Needs Attention</div>
                    </div>
                    <div className="col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 space-y-2.5">
                      <div className="text-[10px] text-gray-500 font-medium mb-1">Score by Category</div>
                      {healthCategories.slice(0, visibleHealthBars).map((cat, i) => (
                        <motion.div key={cat.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] text-gray-500">{cat.label}</span>
                            <span className="text-[9px] text-gray-400 font-medium">{cat.score}</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.score}%` }}
                              transition={{ duration: 0.7, delay: i * 0.1 }}
                              className={`h-1.5 rounded-full ${cat.color}`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: issuesVisible ? 1 : 0, y: issuesVisible ? 0 : 6 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3"
                  >
                    <div className="text-[10px] text-gray-500 font-medium mb-2">Open Issues</div>
                    <div className="space-y-1.5">
                      {[
                        { msg: "16 dashboards without an assigned owner", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                        { msg: "4 datasets not refreshed in over 7 days", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                        { msg: "3 data sources returning connection errors", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                      ].map((issue) => (
                        <div key={issue.msg} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${issue.bg}`}>
                          <AlertTriangle className={`w-2.5 h-2.5 shrink-0 ${issue.color}`} />
                          <span className={`text-[9px] ${issue.color}`}>{issue.msg}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.zoom = "1.25";
    return () => { document.documentElement.style.zoom = ""; };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-orange-500/20 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.05] backdrop-blur-2xl bg-[#050505]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">Helm</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-500">
          <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
          <a href="#platforms" className="hover:text-white transition-colors cursor-pointer">Platforms</a>
          <a href="#pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/overview" className="text-sm text-gray-500 hover:text-white transition-colors">Sign in</Link>
          <Link href="/overview" className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 pt-44 pb-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/8 bg-white/[0.03] rounded-full px-4 py-1.5 mb-10 text-sm text-gray-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          QuickSight connector now available
          <span className="text-orange-400 flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[76px] font-bold tracking-[-0.04em] leading-[1.0] max-w-4xl mb-6"
        >
          Built by BI.
          <br />
          <span className="bg-gradient-to-b from-orange-300 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            For BI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-500 max-w-xl mb-4 leading-relaxed"
        >
          For the analyst who lives in dashboards every day —
          Helm gives you a unified control plane to monitor,
          govern, and optimize your entire BI stack.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-gray-600 mb-10 italic"
        >
          "We built the tool we always wished existed."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/overview"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-orange-500/20"
          >
            View live demo <ArrowRight className="w-4 h-4" />
          </Link>
          
            <Link
            href="#features"
            className="flex items-center gap-2 border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 px-6 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            See features
          </Link>
        </motion.div>

        <CinematicDashboard />
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.05] bg-white/[0.01] py-10 mt-8">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-center text-[10px] text-gray-600 mb-8 uppercase tracking-[0.2em]">
            Trusted by BI teams managing
          </p>
          <div className="grid grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Dashboards tracked" },
              { value: "2,000+", label: "Datasets monitored" },
              { value: "$50k+", label: "In license savings found" },
              { value: "5", label: "BI platforms connected" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight mb-6">You know this feeling.</h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            It's Monday morning. A stakeholder asks why their dashboard number
            doesn't match finance's. You spend 2 hours tracing it back through
            3 datasets, 2 platforms, and 4 Slack threads.
            <br /><br />
            <span className="text-white font-medium">Helm was built so you never have to do that again.</span>
          </p>
          <div className="grid grid-cols-3 gap-4 text-left">
            {[
              { pain: "\"Who owns this dashboard?\"", fix: "Every asset has an assigned owner, team, and domain." },
              { pain: "\"Why are we paying for 300 licenses?\"", fix: "Ghost user detection finds unused licenses instantly." },
              { pain: "\"Is this number correct?\"", fix: "Health scores and lineage tell you exactly where data comes from." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-orange-500/20 transition-all"
              >
                <p className="text-gray-400 italic text-sm mb-3">{item.pain}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-white text-sm">{item.fix}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 py-10 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-medium">Everything in one place</p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Stop switching between admin panels</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Helm surfaces everything that matters across every BI tool your org uses.
          </p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/8", title: "Unified Inventory", desc: "Every dashboard, dataset, and source across all your BI platforms — one view, zero switching." },
            { icon: Users, color: "text-orange-400", bg: "bg-orange-400/8", title: "License Optimization", desc: "Ghost users costing you thousands. Helm finds them in seconds. ROI on day one." },
            { icon: Activity, color: "text-green-400", bg: "bg-green-400/8", title: "Health Scoring", desc: "0-100 score per asset based on usage, ownership, and data freshness. No more guessing." },
            { icon: Shield, color: "text-purple-400", bg: "bg-purple-400/8", title: "Governance", desc: "Owners, certifications, audit trails. Build trust in your data without the manual work." },
            { icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-400/8", title: "Stale Asset Detection", desc: "Dashboards nobody views cluttering your environment. Helm flags and cleans them up." },
            { icon: Database, color: "text-pink-400", bg: "bg-pink-400/8", title: "Data Lineage", desc: "Trace any number back to its raw source. Know the blast radius before you change anything." },
          ].map((feature, i) => (
            <TiltCard key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all h-full cursor-default"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className={`w-9 h-9 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                  style={{ transform: "translateZ(20px)" }}>
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2" style={{ transform: "translateZ(15px)" }}>
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  {feature.desc}
                </p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-medium">Simple setup</p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Up and running in minutes</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { step: "01", title: "Connect your platforms", desc: "Paste your API credentials. Helm connects to QuickSight, Tableau, Power BI, and more in seconds." },
            { step: "02", title: "Helm syncs everything", desc: "All dashboards, datasets, and users are automatically pulled and normalized into one unified view." },
            { step: "03", title: "Take action", desc: "Remove ghost users, assign owners, flag stale assets, and govern your stack — all from one place." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              {i < 2 && (
                <div className="absolute top-6 left-full w-full h-px bg-gradient-to-r from-orange-500/30 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                  <span className="text-orange-400 text-xs font-bold">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="relative z-10 border-t border-white/[0.05] py-28 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-medium">Integrations</p>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Connects to your stack</h2>
            <p className="text-gray-500 mb-16">One platform — no matter which BI tools your org uses.</p>
          </motion.div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "QuickSight", icon: PieIcon, color: "text-orange-400", bg: "bg-orange-400/8", status: "Live", border: "border-orange-400/25" },
              { name: "Tableau", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/8", status: "Soon", border: "border-white/[0.06]" },
              { name: "Power BI", icon: Activity, color: "text-yellow-400", bg: "bg-yellow-400/8", status: "Soon", border: "border-white/[0.06]" },
              { name: "Looker", icon: Layout, color: "text-green-400", bg: "bg-green-400/8", status: "Soon", border: "border-white/[0.06]" },
              { name: "Qlik", icon: Database, color: "text-purple-400", bg: "bg-purple-400/8", status: "Soon", border: "border-white/[0.06]" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`bg-white/[0.02] border ${p.border} rounded-2xl p-5 flex flex-col items-center gap-3 transition-all hover:bg-white/[0.04]`}
              >
                <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <span className="text-white font-medium text-sm">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === "Live"
                    ? "text-green-400 bg-green-400/10 border border-green-400/20"
                    : "text-gray-600 bg-white/[0.03] border border-white/[0.06]"
                }`}>
                  {p.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-8 py-28 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-medium">Pricing</p>
          <h2 className="text-4xl font-bold tracking-tight mb-3">Simple pricing</h2>
          <p className="text-gray-500">Start free. The tool pays for itself on day one.</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              name: "Starter", price: "$199", period: "/mo",
              desc: "For small BI teams getting started",
              features: ["2 platform connectors", "Up to 50 users", "Inventory + usage analytics", "Email support"],
              cta: "Get started", highlight: false,
            },
            {
              name: "Growth", price: "$599", period: "/mo",
              desc: "For scaling data teams",
              features: ["4 platform connectors", "Up to 200 users", "Health scores + stale alerts", "License optimization", "Priority support"],
              cta: "Get started", highlight: true,
            },
            {
              name: "Enterprise", price: "Custom", period: "",
              desc: "For large orgs with complex needs",
              features: ["Unlimited connectors", "Unlimited users", "Governance + compliance", "SSO + audit logs", "Dedicated support"],
              cta: "Talk to us", highlight: false,
            },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-8 border transition-all relative ${
                plan.highlight
                  ? "bg-orange-500/8 border-orange-500/25 shadow-xl shadow-orange-500/5"
                  : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg shadow-orange-500/30">
                  Most popular
                </div>
              )}
              <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                plan.highlight
                  ? "bg-orange-500 hover:bg-orange-400 text-white"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08]"
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/[0.05] py-32 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-6">For the analyst in the trenches</p>
          <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Ready to take the helm<br />of your BI stack?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
            Join BI teams who finally have visibility into what's working, what's broken, and what's costing them money.
          </p>
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-xl shadow-orange-500/15"
          >
            View demo dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-gray-700 text-xs mt-4">No signup required · Live demo available now</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-500 font-medium">Helm</span>
        </div>
        <p className="text-sm text-gray-700">© 2026 Helm. Built by BI, for BI.</p>
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <Link href="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-gray-400 transition-colors">Terms</Link>
        </div>
      </footer>

    </div>
  );
}