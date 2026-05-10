const METABASE_URL = process.env.METABASE_URL;
const METABASE_API_KEY = process.env.METABASE_API_KEY;

const headers = {
  "x-api-key": METABASE_API_KEY!,
  "Content-Type": "application/json",
};

export async function getMetabaseDashboards() {
  const res = await fetch(`${METABASE_URL}/api/dashboard`, { headers });
  const data = await res.json();
  return data.map((d: any) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    views: d.view_count,
    updatedAt: d.updated_at,
    createdAt: d.created_at,
    archived: d.archived,
    owner: d.creator
      ? `${d.creator.first_name} ${d.creator.last_name}`
      : "Unassigned",
  }));
}

export async function getMetabaseCollections() {
  const res = await fetch(`${METABASE_URL}/api/collection`, { headers });
  const data = await res.json();
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
}

export async function getMetabaseUsers() {
  const res = await fetch(`${METABASE_URL}/api/user`, { headers });
  const data = await res.json();
  return data.data.map((u: any) => ({
    id: u.id,
    name: `${u.first_name} ${u.last_name}`,
    email: u.email,
    isAdmin: u.is_superuser,
    lastLogin: u.last_login,
    isActive: u.is_active,
  }));
}

export async function getMetabaseCards() {
  const res = await fetch(`${METABASE_URL}/api/card`, { headers });
  const data = await res.json();
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    type: c.display,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    views: c.view_count,
    owner: c.creator
      ? `${c.creator.first_name} ${c.creator.last_name}`
      : "Unassigned",
  }));
}