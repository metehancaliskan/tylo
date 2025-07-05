import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// If you see a type error for supabase-js, run: yarn add @supabase/supabase-js @types/node

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type !== "user.created" || !body.user) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const privy_id = body.user.id;
    const twitterAccount = (body.user.linked_accounts || []).find(
      (acc: Record<string, unknown>) => acc.type === "twitter"
    );
    if (!twitterAccount) {
      return NextResponse.json(
        { error: "No Twitter account linked" },
        { status: 400 }
      );
    }
    const x_username = twitterAccount.username as string;
    const x_profile_picture_url = twitterAccount.profilePictureUrl as string;
    if (!privy_id || !x_username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("users").insert([
      {
        privy_id,
        x_username,
        x_profile_picture_url,
      },
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err && "message" in err
        ? (err as { message: string }).message
        : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
