"use client";

import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const menuItems = [
  { label: "My Wallets", key: "wallets" },
  { label: "Leaderboard", key: "leaderboard" },
  { label: "My Scores", key: "scores" },
  { label: "Joined Narratives", key: "narratives" },
];

export default function DashboardPage() {
  const { user } = usePrivy();
  const { linkEmail, linkWallet } = useLinkAccount();
  const [selected, setSelected] = useState("wallets");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6 hidden md:block">
        <div className="mb-8">
          <div className="font-bold text-xl mb-2">Dashboard</div>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant={selected === item.key ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setSelected(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Section */}
        <Card className="mb-8 max-w-xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center text-2xl font-bold">
                {user?.twitter ? (
                  <span>🐦</span>
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {user?.twitter?.username || (typeof user?.email === 'string' ? user.email : undefined) || "Anonymous"}
                </div>
                <div className="text-muted-foreground text-sm">
                  {user?.twitter ? "Connected to X (Twitter)" : "Not connected to X (Twitter)"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={linkEmail}>Link Email</Button>
              <Button variant="outline" onClick={linkWallet}>Link Wallet</Button>
            </div>
          </CardContent>
        </Card>
        {/* Section Content */}
        <div>
          {selected === "wallets" && <div>My Wallets (coming soon)</div>}
          {selected === "leaderboard" && <div>Leaderboard (coming soon)</div>}
          {selected === "scores" && <div>My Scores (coming soon)</div>}
          {selected === "narratives" && <div>Joined Narratives (coming soon)</div>}
        </div>
      </main>
    </div>
  );
} 