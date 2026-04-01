export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
