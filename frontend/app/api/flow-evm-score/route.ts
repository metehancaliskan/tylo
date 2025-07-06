import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address param" }, { status: 400 });
  }
  try {
    const res = await fetch(`https://evm.flowscan.io/api/v2/addresses/${address}/transactions`);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Flow EVM API" }, { status: 502 });
    }
    const data = await res.json();
    const txCount = Array.isArray(data.items) ? data.items.length : 0;
    const score = Math.round(txCount * 1.5);
    return NextResponse.json({ score, txCount });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
} 