# Helm — BI Operations Platform

> Built by BI. For BI.

**Helm is the control plane for your BI stack.** Connect every BI tool in your organization — QuickSight, Tableau, Power BI, Looker, Qlik — and get a unified view of every dashboard, dataset, and user across your entire analytics environment.

Built by a BI engineer who lived the pain. Designed for the analyst who lives in dashboards every day.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-pink)

---

## The Problem

You know this feeling.

It's Monday morning. A stakeholder asks why their dashboard number doesn't match finance's. You spend 2 hours tracing it back through 3 datasets, 2 platforms, and 4 Slack threads.

Or you get asked to cut BI costs and realize you have no idea how many of your 300 licensed users actually log in.

Or a dataset breaks and you don't know which 14 dashboards just stopped working.

**Helm was built so you never have to deal with that again.**

---

## What Helm Does

### 🎛️ Unified BI Inventory
Connect all your BI platforms and see every asset — dashboards, datasets, data sources, and users — in one place. No more switching between admin panels.

### 👥 License Optimization
Detect ghost users who haven't logged in for 30, 60, or 90+ days. A single click shows you exactly how much you're wasting. ROI on day one.

### 🏥 Asset Health Scoring
Every dashboard and dataset gets a health score from 0–100 based on three factors:
- **Usage (40%)** — view count, active users, view frequency
- **Ownership (30%)** — assigned owner, owner activity
- **Data Freshness (30%)** — last refresh vs. expected SLA

### 🚨 Smart Alerts
Get notified when dashboards go stale, datasets stop refreshing, assets have no owner, or user adoption drops below threshold.

### 🔍 Stale Asset Detection
Automatically surface dashboards nobody has viewed in 60, 90, or 180 days. Clean up your environment before it becomes a governance nightmare.

### 🗂️ Ownership Registry
Every asset gets an owner, team, and domain. No more "who built this?" conversations at 9am on a Monday.

### 🔗 Data Lineage
Trace any number back to its raw source table. Know the full blast radius before you change anything upstream.

### ⚙️ Settings & Platform Manager
Connect and manage all your BI platform credentials in one place. Toggle auto-sync, configure alert thresholds, and manage your team's access.

---

## Interface & Design

Helm is built with a dark-first, professional design system inspired by tools like Resend, Linear, and Raycast.

### Landing Page
- Animated hero with a **live dashboard being built in real time** — cursor moves, chart draws bar by bar, rows appear one by one
- 3D tilt effect on feature cards
- Animated gradient background orbs
- Scroll-triggered motion animations throughout
- Sections: Hero → Social Proof → Pain Points → Features → Platforms → Pricing → CTA

### Dashboard App
- **Sidebar** — fixed navigation with active state, platform badge, user profile
- **Navbar** — global search, platform status pills, sync button, notifications
- **Overview** — KPI stat cards, alerts panel, recent assets table
- **Dashboards** — full inventory table with search, filter tabs, health badges, status icons
- **Datasets** — SPICE vs Direct Query breakdown, source tagging, refresh tracking
- **Users** — license optimization banner, ghost user detection, remove license actions
- **Health** — health score bars, score breakdown by factor, filterable asset list
- **Settings** — platform connection cards, sync toggles, danger zone

### Design System
- Color: Orange accent (`#f97316`) on pure black (`#050505`)
- Typography: Geist font, tight tracking, bold hierarchy
- Components: shadcn/ui + custom built on Tailwind v4
- Motion: Framer Motion for all animations and transitions
- Icons: Lucide React throughout

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | Full-stack React framework |
| **Language** | TypeScript | Type safety end-to-end |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Components** | shadcn/ui (Radix + Nova) | Accessible UI primitives |
| **Animation** | Framer Motion | Page and component animations |
| **Database** | Supabase (PostgreSQL) | Multi-tenant data storage |
| **Auth** | Supabase Auth | User authentication |
| **BI Connector** | AWS SDK (QuickSight) | First platform integration |
| **AI Layer** | Anthropic API | Health summaries, insights |
| **Deployment** | Vercel | CI/CD and hosting |

---

## Platform Connectors

| Platform | Status | What's Available |
|---|---|---|
| **Amazon QuickSight** | ✅ Available | Dashboards, datasets, users, groups |
| **Tableau** | 🔲 Coming Soon | Workbooks, views, data sources, users |
| **Power BI** | 🔲 Coming Soon | Reports, datasets, workspaces, users |
| **Looker** | 🔲 Coming Soon | Dashboards, looks, explores, users |
| **Qlik** | 🔲 Coming Soon | Apps, sheets, data connections, users |

---

## Getting Started

### Prerequisites
- Node.js v20+
- AWS Account with QuickSight enabled
- Supabase account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/sovit-nayak/helm-bi.git
cd helm-bi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see below)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Open [http://localhost:3000/overview](http://localhost:3000/overview) to see the dashboard.

### Environment Variables

Create a `.env.local` file at the root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AWS QuickSight
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_ACCOUNT_ID=your_aws_account_id

# Anthropic AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```

## Project Structure
helm-bi/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar + Navbar wrapper
│   │   │   ├── overview/page.tsx   # KPI overview
│   │   │   ├── dashboards/page.tsx # Asset inventory
│   │   │   ├── datasets/page.tsx   # Dataset inventory
│   │   │   ├── users/page.tsx      # User + license management
│   │   │   ├── health/page.tsx     # Health scoring
│   │   │   └── settings/page.tsx   # Platform connections
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── Navbar.tsx          # Top navigation bar
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/               # Supabase client
│   │   ├── connectors/             # BI platform connectors
│   │   └── utils.ts                # Shared utilities
│   ├── types/                      # TypeScript types
│   └── hooks/                      # Custom React hooks
├── supabase/
│   └── migrations/                 # Database schema
├── .env.local                      # Environment variables
└── .env.example                    # Environment template

```

## Roadmap

### ✅ Completed
- [x] Landing page with animated live dashboard hero
- [x] 3D tilt feature cards with Framer Motion
- [x] Sidebar + Navbar layout system
- [x] Overview page — KPI cards, alerts, recent assets
- [x] Dashboards page — inventory, search, filters, health scores
- [x] Datasets page — SPICE vs Direct Query, refresh tracking
- [x] Users page — ghost user detection, license optimization
- [x] Health scores page — score bars, factor breakdown
- [x] Settings page — platform connections, sync toggles
- [x] GitHub branching strategy (feature → dev → main)
- [x] Branch protection rules configured

### 🔲 In Progress
- [ ] QuickSight API integration (real data)
- [ ] Supabase database schema + migrations
- [ ] Authentication with Supabase Auth
- [ ] Multi-tenant organization support
- [ ] Deploy to Vercel production

### 🗓️ Planned
- [ ] Tableau connector
- [ ] Power BI connector
- [ ] Looker connector
- [ ] AI-powered health summaries (Anthropic API)
- [ ] Slack / Teams alert integrations
- [ ] Data lineage visualization
- [ ] Certification workflow
- [ ] Custom domain — helm-bi.com

---

## Database Schema

Helm uses a normalized multi-tenant schema:

```sql
organizations        -- Your customers
platform_connections -- BI tool credentials per org
assets               -- Unified dashboards + datasets
platform_users       -- Users across all platforms
usage_events         -- View/edit/share activity
```

---

## Contributing

This project is currently in private beta. If you're a BI engineer and want to be an early design partner — reach out.

---

## License

MIT

---

<div align="center">

**Helm — Built by BI. For BI.**

*For the analyst who lives in dashboards every day.*

[Website](https://helm-bi.com) · [Demo](https://helm-bi.com/overview) · [Twitter](https://twitter.com/sovit-nayak)

</div>