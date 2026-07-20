// Shared helpers for corpus importers
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

export type Doc = {
  uid: string;
  source: "openalex" | "lens_scholar" | "lens_patent" | "gdelt";
  doc_type: "publication" | "patent_application" | "patent_grant" | "news";
  title: string;
  abstract?: string | null;
  year?: number | null;
  date?: string | null;
  url?: string | null;
  doi?: string | null;
  lens_id?: string | null;
  orgs?: string[];
  countries?: string[];
  citations?: number | null;
  raw?: unknown;
};

export async function upsertDocuments(docs: Doc[]) {
  if (!docs.length) return { inserted: 0 };
  const client = admin();
  const { error, count } = await client
    .from("documents")
    .upsert(docs, { onConflict: "uid", ignoreDuplicates: false, count: "exact" });
  if (error) throw error;
  return { inserted: count ?? docs.length };
}

export async function getActiveProfile() {
  const { data, error } = await admin()
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function logQA(entry: {
  level: "info" | "warning" | "error";
  category: string;
  section?: string;
  message: string;
  details?: unknown;
}) {
  try {
    await admin().from("qa_log").insert({
      level: entry.level,
      category: entry.category,
      section: entry.section,
      message: entry.message,
      details: entry.details as any,
    });
  } catch (_) { /* ignore */ }
}

export async function sha1Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
