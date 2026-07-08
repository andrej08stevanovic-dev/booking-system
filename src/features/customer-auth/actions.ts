"use server";

import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findCustomerIdsByEmail } from "@/lib/email-match";

export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();

  if (email && /.+@.+\..+/.test(email)) {
    // Check if customer exists in mock DB or just allow any email for ease of demo
    // We allow any email so the client can log in and see their own fresh booking list
    const store = await cookies();
    store.set("demo_customer_email", email, { maxAge: 60 * 60 * 24 * 30 });
    redirect("/moja-zakazivanja");
  }

  redirect("/prijava?poslato=1");
}

export async function signOutCustomer(): Promise<void> {
  const store = await cookies();
  store.delete("demo_customer_email");
  redirect("/prijava");
}
