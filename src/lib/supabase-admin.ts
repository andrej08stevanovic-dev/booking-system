import "server-only";
import { mockSupabaseClient } from "./supabase-mock";

// Swapped out real Supabase admin client for in-memory mock database
export const supabaseAdmin = mockSupabaseClient;
