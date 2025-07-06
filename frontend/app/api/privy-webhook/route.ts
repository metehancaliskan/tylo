import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// If you see a type error for supabase-js, run: yarn add @supabase/supabase-js @types/node

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log("[privy-webhook] Incoming request");
    const body = await req.json();
    console.log("[privy-webhook] Parsed body:", JSON.stringify(body, null, 2));
    if ((body.type !== "user.created" && body.type !== "user.linked_account") || !body.user) {
      console.log("[privy-webhook] Invalid payload: type or user missing");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const privy_id = body.user.id;
    console.log("[privy-webhook] user.linked_accounts:", JSON.stringify(body.user.linked_accounts, null, 2));
    const twitterAccount = (body.user.linked_accounts || []).find(
      (acc: Record<string, unknown>) => acc.type === "twitter_oauth"
    );
    const walletAccount = (body.user.linked_accounts || []).find(
      (acc: Record<string, unknown>) => acc.type === "wallet" && acc.address && acc.wallet_client !== "privy"
    );
    const wallet_address = walletAccount ? (walletAccount.address as string) : null;
    console.log("[privy-webhook] selected wallet_address (non-privy):", wallet_address);
    if (!twitterAccount) {
      console.log("[privy-webhook] No Twitter account linked");
      return NextResponse.json(
        { error: "No Twitter account linked" },
        { status: 400 }
      );
    }
    const x_username = twitterAccount.username as string | undefined;
    const x_profile_picture_url = twitterAccount.profile_picture_url as string | undefined;
    console.log("[privy-webhook] privy_id:", privy_id);
    console.log("[privy-webhook] x_username:", x_username);
    console.log("[privy-webhook] x_profile_picture_url:", x_profile_picture_url);
    if (!privy_id || !x_username) {
      console.log("[privy-webhook] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (body.type === "user.created") {
      const { error } = await supabase.from("users").insert([
        {
          privy_id,
          x_username,
          x_profile_picture_url,
          wallet_address,
        },
      ]);
      if (error) {
        console.log("[privy-webhook] Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      console.log("[privy-webhook] User inserted successfully");
      return NextResponse.json({ success: true });
    } else if (body.type === "user.linked_account") {
      const { error } = await supabase.from("users").update({ wallet_address }).eq("privy_id", privy_id);
      if (error) {
        console.log("[privy-webhook] Supabase update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      console.log("[privy-webhook] User wallet updated successfully");
      return NextResponse.json({ success: true });
    }
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err && "message" in err
        ? (err as { message: string }).message
        : "Unknown error";
    console.log("[privy-webhook] Exception caught:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
