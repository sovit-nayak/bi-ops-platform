import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const results = {
    dashboards: [] as any[],
    datasets: [] as any[],
    users: [] as any[],
    connectedPlatforms: [] as string[],
    meta: {
      dashboardCount: 0,
      datasetCount: 0,
      userCount: 0,
      syncedAt: new Date().toISOString(),
    }
  };

  try {
    // Get logged in user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If not logged in → fall back to env vars (demo mode)
    if (!user) {
      if (process.env.METABASE_URL && process.env.METABASE_API_KEY) {
        const { getMetabaseDashboards, getMetabaseUsers, getMetabaseCards } = await import("@/lib/connectors/metabase");
        const [dashboards, users, cards] = await Promise.all([
          getMetabaseDashboards(),
          getMetabaseUsers(),
          getMetabaseCards(),
        ]);
        results.dashboards.push(...dashboards.map((d: any) => ({ ...d, platform: "Metabase" })));
        results.datasets.push(...cards.map((c: any) => ({ ...c, platform: "Metabase" })));
        results.users.push(...users.map((u: any) => ({ ...u, platform: "Metabase" })));
        results.connectedPlatforms.push("Metabase");
      }
      results.meta.dashboardCount = results.dashboards.length;
      results.meta.datasetCount = results.datasets.length;
      results.meta.userCount = results.users.length;
      return NextResponse.json(results);
    }

    // Get user's connected platforms from Supabase
    const { data: connections } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (!connections || connections.length === 0) {
      return NextResponse.json(results);
    }

    // Loop through each connected platform
    for (const conn of connections) {

      // Metabase
      if (conn.platform === "metabase") {
        try {
          const { getMetabaseDashboards, getMetabaseUsers, getMetabaseCards } = await import("@/lib/connectors/metabase");

          // Temporarily set env vars from user's saved credentials
          process.env.METABASE_URL = conn.url;
          process.env.METABASE_API_KEY = conn.api_key;

          const [dashboards, users, cards] = await Promise.all([
            getMetabaseDashboards(),
            getMetabaseUsers(),
            getMetabaseCards(),
          ]);

          results.dashboards.push(...dashboards.map((d: any) => ({ ...d, platform: "Metabase" })));
          results.datasets.push(...cards.map((c: any) => ({ ...c, platform: "Metabase" })));
          results.users.push(...users.map((u: any) => ({ ...u, platform: "Metabase" })));
          results.connectedPlatforms.push("Metabase");
        } catch (e) {
          console.error("Metabase connection failed:", e);
        }
      }

      // QuickSight (uncomment when ready)
      // if (conn.platform === "quicksight") { ... }

      // Tableau (uncomment when ready)
      // if (conn.platform === "tableau") { ... }
    }

  } catch (e) {
    console.error("Connector error:", e);
  }

  results.meta.dashboardCount = results.dashboards.length;
  results.meta.datasetCount = results.datasets.length;
  results.meta.userCount = results.users.length;

  return NextResponse.json(results);
}