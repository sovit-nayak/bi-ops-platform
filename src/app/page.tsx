"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  BarChart3, Database, Users, Activity, ArrowRight,
  CheckCircle, Zap, Shield, RefreshCw, PieChart,
  Layout, AlertTriangle, Clock,
} from "lucide-react";

// --- Sleep helper ---
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// --- Tilt Card ---
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

// --- Animated Cursor ---
function Cursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <motion.div
      animate={{ left: x, top: y, scale: clicking ? 0.85 : 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 22 }}
      className="absolute z-50 pointer-events-none"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M4 2L16 10L10 11.5L7.5 18L4 2Z" fill="white" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" />
      </svg>
    </motion.div>
  );
}

// --- Live Dashboard ---
function LiveDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 70, y: 60 });
  const [clicking, setClicking] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);
  const [activeRow, setActiveRow] = useState(-1);
  const [chartBars, setChartBars] = useState([0, 0, 0, 0, 0, 0]);

  const navItems = ["Overview", "Dashboards", "Datasets", "Users", "Health"];
  const chartData = [65, 82, 45, 91, 73, 88];
  const rows = [
    { name: "Revenue Overview", owner: "Sarah K.", time: "2h ago", health: 95, color: "bg-green-500" },
    { name: "Marketing Model", owner: "James R.", time: "1d ago", health: 82, color: "bg-green-500" },
    { name: "Churn Analysis", owner: "Priya M.", time: "3d ago", health: 67, color: "bg-yellow-500" },
    { name: "Q1 Sales", owner: "Unassigned", time: "45d ago", health: 23, color: "bg-red-500" },
  ];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        // Reset
        setVisibleRows(0);
        setChartBars([0, 0, 0, 0, 0, 0]);
        setActiveRow(-1);
        setActiveNav(0);
        setCursorPos({ x: 70, y: 60 });

        await sleep(600);

        // Phase 1 — cursor clicks nav items
        for (let i = 0; i < navItems.length; i++) {
          if (cancelled) return;
          setCursorPos({ x: 72, y: 58 + i * 30 });
          await sleep(500);
          setClicking(true);
          await sleep(150);
          setClicking(false);
          setActiveNav(i);
          await sleep(400);
        }

        // Back to overview
        await sleep(300);
        setCursorPos({ x: 72, y: 58 });
        setClicking(true);
        await sleep(150);
        setClicking(false);
        setActiveNav(0);
        await sleep(500);

        // Phase 2 — chart builds bar by bar
        setCursorPos({ x: 480, y: 180 });
        await sleep(400);
        for (let i = 0; i < chartData.length; i++) {
          if (cancelled) return;
          await sleep(220);
          setChartBars(prev => {
            const next = [...prev];
            next[i] = chartData[i];
            return next;
          });
          setCursorPos({ x: 380 + i * 30, y: 200 });
        }

        await sleep(500);

        // Phase 3 — rows appear one by one
        setCursorPos({ x: 350, y: 290 });
        await sleep(400);
        for (let i = 0; i < rows.length; i++) {
          if (cancelled) return;
          setVisibleRows(i + 1);
          setCursorPos({ x: 350, y: 305 + i * 36 });
          await sleep(450);
        }

        // Phase 4 — hover over rows
        await sleep(300);
        for (let i = 0; i < rows.length; i++) {
          if (cancelled) return;
          setActiveRow(i);
          setCursorPos({ x: 260, y: 305 + i * 36 });
          await sleep(400);
        }
        setActiveRow(-1);

        // Pause before loop
        await sleep(1200);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="relative w-full max-w-5xl mx-auto mt-20"
    >
      {/* Glow underneath */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-orange-500/15 blur-3xl rounded-full pointer-events-none" />

      {/* Floating animation */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-[#0a0a0a] border border-white/8 rounded-2xl overflow-hidden shadow-2xl"
        style={{ userSelect: "none" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 bg-black/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-6 bg-white/5 rounded-md h-5 flex items-center px-3">
            <span className="text-[10px] text-gray-600">helm-bi.com/overview</span>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/20 px-3 py-1 rounded-full"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-[10px] text-orange-400 font-medium">Live</span>
          </motion.div>
        </div>

        {/* Body */}
        <div className="flex relative overflow-hidden" style={{ height: "400px" }}>

          {/* Cursor */}
          <Cursor x={cursorPos.x} y={cursorPos.y} clicking={clicking} />

          {/* Sidebar */}
          <div className="w-48 border-r border-white/5 p-3 space-y-0.5 shrink-0 z-10">
            {navItems.map((item, i) => (
              <motion.div
                key={item}
                animate={{
                  backgroundColor: activeNav === i ? "rgb(249,115,22)" : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs"
              >
                <div className={`w-3 h-3 rounded ${activeNav === i ? "bg-white/50" : "bg-white/10"}`} />
                <span className={activeNav === i ? "text-white font-medium" : "text-gray-600"}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 space-y-3 overflow-hidden z-10">

            {/* Header */}
            <div>
              <div className="text-white font-semibold text-sm">BI Operations Overview</div>
              <div className="text-gray-600 text-xs mt-0.5 flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                />
                QuickSight · syncing live
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Dashboards", value: "48", color: "text-blue-400", bg: "bg-blue-500/8" },
                { label: "Datasets", value: "124", color: "text-purple-400", bg: "bg-purple-500/8" },
                { label: "Active Users", value: "36", color: "text-green-400", bg: "bg-green-500/8" },
                { label: "Avg Health", value: "73", color: "text-orange-400", bg: "bg-orange-500/8" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={`${stat.bg} border border-white/5 rounded-xl p-2.5`}
                >
                  <div className="text-gray-500 text-[9px] mb-1">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 mb-2 font-medium">Dashboard views — last 6 months</div>
              <div className="flex items-end gap-2" style={{ height: "56px" }}>
                {chartBars.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "56px" }}>
                    <motion.div
                      animate={{ height: val > 0 ? `${val}%` : "2px" }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className={`w-full rounded-sm ${val > 0 ? "bg-orange-500/70" : "bg-white/5"}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 bg-yellow-500/8 border border-yellow-500/15 rounded-lg px-3 py-1.5"
            >
              <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0" />
              <span className="text-[10px] text-yellow-400">16 ghost users — $1,360/mo recoverable</span>
            </motion.div>

            {/* Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
                {["Name", "Owner", "Last Viewed", "Health"].map(h => (
                  <span key={h} className="text-[9px] text-gray-600 font-medium uppercase tracking-wide">{h}</span>
                ))}
              </div>
              {rows.slice(0, visibleRows).map((row, i) => (
                <motion.div
                  key={row.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`grid grid-cols-4 px-3 py-2 border-b border-white/5 last:border-0 transition-colors ${
                    activeRow === i ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <span className="text-white text-[11px] font-medium truncate pr-2">{row.name}</span>
                  <span className={`text-[11px] ${row.owner === "Unassigned" ? "text-red-400" : "text-gray-500"}`}>
                    {row.owner}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-gray-600" />
                    <span className="text-[11px] text-gray-500">{row.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 bg-gray-800 rounded-full h-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.health}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-1 rounded-full ${row.color}`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{row.health}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Landing Page ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Animated glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-orange-500/20 rounded-full blur-[140px]"
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.06] backdrop-blur-2xl bg-[#050505]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">Helm</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-500">
          {["Features", "Platforms", "Pricing"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/overview" className="text-sm text-gray-500 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/overview"
            className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-4 pt-44 pb-10 z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/8 bg-white/[0.03] rounded-full px-4 py-1.5 mb-10 text-sm text-gray-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          QuickSight connector now available
          <span className="text-orange-400 flex items-center gap-1">
            Read more <ArrowRight className="w-3 h-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[72px] font-bold tracking-[-0.04em] leading-[1.05] max-w-4xl mb-6"
        >
          Built by BI.
          <br />
          <span className="bg-gradient-to-b from-orange-300 to-orange-600 bg-clip-text text-transparent">
            For BI.
          </span>
        </motion.h1>

        {/* Subheadline */}
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

        {/* CTAs */}
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
            View live demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 px-6 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            See features
          </Link>
        </motion.div>

        {/* Live Dashboard */}
        <LiveDashboard />
      </section>

      {/* Social proof */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.015] py-8 mt-10">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-center text-xs text-gray-600 mb-6 uppercase tracking-widest">
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
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
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
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
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
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Everything in one place</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Stop switching between admin panels. Helm surfaces everything that matters.
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
                <div
                  className={`w-9 h-9 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                  style={{ transform: "translateZ(20px)" }}
                >
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

      {/* Platforms */}
      <section id="platforms" className="relative z-10 border-t border-white/[0.06] py-28">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-3">Connects to your stack</h2>
            <p className="text-gray-500 mb-16">
              One platform — no matter which BI tools your org has standardized on.
            </p>
          </motion.div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "QuickSight", icon: PieChart, color: "text-orange-400", bg: "bg-orange-400/8", status: "Live", border: "border-orange-400/20" },
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
                whileHover={{ scale: 1.04 }}
                className={`bg-white/[0.02] border ${p.border} rounded-2xl p-5 flex flex-col items-center gap-3 transition-all`}
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
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
              className={`rounded-2xl p-8 border transition-all relative ${
                plan.highlight
                  ? "bg-orange-500/8 border-orange-500/25"
                  : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm">{plan.desc}</p>
              </div>
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

      {/* Final CTA */}
      <section className="relative z-10 border-t border-white/[0.06] py-32 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-6">
            For the analyst in the trenches
          </p>
          <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Ready to take the helm<br />of your BI stack?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
            Join BI teams who finally have visibility into what's working,
            what's broken, and what's costing them money.
          </p>
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-xl shadow-orange-500/15"
          >
            View demo dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-gray-700 text-xs mt-4">No signup required · Live demo available now</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-8 flex items-center justify-between">
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