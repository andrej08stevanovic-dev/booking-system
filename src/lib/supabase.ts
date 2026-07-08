import { mockSupabaseClient } from "./supabase-mock";

// Swapped out real Supabase client for in-memory mock database
export const supabase = mockSupabaseClient;
