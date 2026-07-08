import "server-only";
import { cookies } from "next/headers";
import { mockSupabaseClient } from "./supabase-mock";
import { SupabaseClient } from "@supabase/supabase-js";

// Mock server client that reads customer email from cookies instead of real Supabase Auth
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const email = cookieStore.get("demo_customer_email")?.value || null;

  const client = {
    ...mockSupabaseClient,
    auth: {
      ...mockSupabaseClient.auth,
      async getUser() {
        if (!email) {
          return { data: { user: null }, error: { message: "No session active" } } as any;
        }
        return {
          data: {
            user: {
              email: email
            }
          },
          error: null
        } as any;
      },
      async signOut() {
        return { data: null, error: null } as any;
      }
    }
  };

  return client as unknown as SupabaseClient<any>;
}
