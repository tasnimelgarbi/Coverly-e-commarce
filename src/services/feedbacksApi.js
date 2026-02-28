const BASE = import.meta.env.VITE_API_BASE_URL;

export async function listFeedbacks() {
  const r = await fetch(`${BASE}/feedbacks`);
  if (!r.ok) throw new Error("Failed to load feedbacks");
  return r.json();
}