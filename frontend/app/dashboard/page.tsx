/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useState, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { ProfileCard } from "./ProfileCard";
import { Leaderboard } from "./Leaderboard";
import { ScoresChart } from "./ScoresChart";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card as UICard, CardHeader as UICardHeader, CardTitle as UICardTitle, CardContent as UICardContent, CardFooter as UICardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import type { WalletWithMetadata, LinkedAccountWithMetadata } from "@privy-io/react-auth";
import html2canvas from "html2canvas";

const menuItems = [
  { label: "My Wallets", key: "wallets" },
  { label: "Leaderboard", key: "leaderboard" },
  { label: "My Scores", key: "scores" },
  { label: "Joined Narratives", key: "narratives" },
];

const availablePrograms = [
  { key: "katana", name: "Katana Yapping", description: "Earn rewards by yapping about Katana!", logo: "/katana-logo.png" },
  { key: "avax", name: "Avax Yapping", description: "Join the Avax narrative and boost your score!", logo: "/avax-logo.png" },
  { key: "arbitrum", name: "Arbitrum Yapping", description: "Yap about Arbitrum and earn Tylo rewards!", logo: "/arbitrum-logo.png" },
  { key: "virtuals", name: "Virtuals Yapping", description: "Get in early on Virtuals narratives!", logo: "/virtuals-logo.png" },
];
const joinedPrograms = ["$FLOW Narrative", "$TYLO Genesis", "SocialFi OGs"];

export default function DashboardPage() {
  const { user, logout } = usePrivy();
  const { linkEmail, linkWallet } = useLinkAccount();
  const [selected, setSelected] = useState("wallets");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const username = user?.twitter?.username || undefined;
  const email = typeof user?.email === "string" ? user.email : undefined;
  const xProfileImage = user?.twitter?.profilePictureUrl || undefined;
  const isXConnected = !!user?.twitter;

  function isWallet(acc: LinkedAccountWithMetadata): acc is WalletWithMetadata {
    return acc.type === 'wallet' && typeof (acc as WalletWithMetadata).address === 'string';
  }
  const walletObj = user?.linkedAccounts?.find(
    (acc) => isWallet(acc) && acc.walletClientType !== 'privy'
  );
  const walletAddress = walletObj ? (walletObj as WalletWithMetadata).address : undefined;
  // @ts-expect-error: linked_accounts comes from Privy API response
  const linkedWallets = user?.linked_accounts?.filter((acc: any) => acc.type === 'wallet') ?? [];

  // Modal state for fake join
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // State for FLOW EVM score
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);

  const [flowScore, setFlowScore] = useState<number>(() => Math.floor(1000 + Math.random() * 9000));

  async function evaluateFlowScore() {
    setFlowLoading(true);
    setFlowError(null);
    try {
      // Demo: fake calculation using random value
      const fakeScore = Math.floor(1000 + Math.random() * 9000);
      setTimeout(() => {
        setFlowScore(fakeScore);
        setFlowLoading(false);
      }, 1200);
    } catch {
      setFlowError("Failed to evaluate score.");
      setFlowLoading(false);
    }
  }

  // Wrap logout to redirect after
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Header with sidebar toggle
  function DashboardHeader() {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          {/* Sidebar toggle for mobile */}
          <div className="mr-4 flex md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  menuItems={menuItems}
                  selected={selected}
                  setSelected={setSelected}
                  onLogout={handleLogout}
                />
              </SheetContent>
            </Sheet>
          </div>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/tylo-logo.png"
              alt="Tylo Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="hidden font-bold sm:inline-block">Tylo</span>
          </div>
          <div className="flex-1" />
          {/* Theme toggle and logout */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar
            menuItems={menuItems}
            selected={selected}
            setSelected={setSelected}
            onLogout={handleLogout}
          />
        </div>
        {/* Main Content + Right Sidebar */}
        <main className="flex-1 p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Profile Section (will be enhanced to a row next) */}
            <ProfileCard
              username={username}
              email={email}
              xProfileImage={xProfileImage}
              isXConnected={isXConnected}
              onLinkEmail={linkEmail}
              onLinkWallet={linkWallet}
              onLogout={handleLogout}
              walletAddress={walletAddress}
              linkedAccounts={user?.linkedAccounts}
              linkedWallets={linkedWallets}
            />
            {/* Section Content */}
            <div>
              {selected === "wallets" && (
                <div>
                  <div className="font-bold text-lg mb-4">My Linked Wallets</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {linkedWallets.length === 0 && (
                      <div className="text-muted-foreground">No wallets linked yet.</div>
                    )}
                    {linkedWallets.map((w: { address?: string; wallet_client?: string }, i: number) => (
                      <UICard key={i} className="flex flex-col gap-2 p-4 border-2 border-primary/30 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M8 11h4"/><path d="M15 17v2"/></svg>
                          <span className="font-mono text-sm">{w.address ? w.address.slice(0, 6) + "..." + w.address.slice(-4) : "Wallet"}</span>
                          {w.wallet_client && w.wallet_client !== "privy" && (
                            <span className="bg-green-100 text-green-700 px-1 rounded ml-1 text-xs">{w.wallet_client}</span>
                          )}
                          {w.wallet_client === "privy" && (
                            <span className="bg-gray-100 text-gray-700 px-1 rounded ml-1 text-xs">Privy</span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { navigator.clipboard.writeText(w.address || ""); toast.success("Copied!"); }}
                            disabled={!w.address}
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            disabled={!w.address}
                          >
                            <a href={w.address ? `https://evm.flowscan.io/address/${w.address}` : "#"} target="_blank" rel="noopener noreferrer">
                              View on Explorer
                            </a>
                          </Button>
                        </div>
                      </UICard>
                    ))}
                  </div>
                </div>
              )}
              {selected === "leaderboard" && <Leaderboard />}
              {selected === "scores" && (
                <>
                  <div className="mb-4 p-4 bg-muted border-l-4 border-primary rounded">
                    <span className="font-semibold text-primary">Info:</span> You have to publish tweets about the narrative programs you joined, for example; <span className="font-mono">$FLOW</span>.
                  </div>
                  <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-900">
                    <span className="font-semibold">Notice:</span> Your tweets that include <span className="font-mono">FLOW</span>, <span className="font-mono">Flow EVM</span>, <span className="font-mono">$FLOW</span> etc. are evaluated daily with our AI Agent.<br />
                    Your scoring will be available in a few hours after you tweet.
                  </div>
                  {walletAddress && (
                    <div className="mb-4">
                      <button
                        className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
                        onClick={evaluateFlowScore}
                        disabled={flowLoading}
                      >
                        {flowLoading ? "Evaluating..." : "Evaluate my FLOW EVM score"}
                      </button>
                      {flowScore !== null && (
                        <div className="mt-2 p-3 bg-green-50 border-l-4 border-green-500 rounded text-green-800 font-semibold">
                          Your FLOW EVM Score: <span className="text-lg">{flowScore}</span> (based on your transaction count)
                        </div>
                      )}
                      {flowError && (
                        <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-800 font-semibold">
                          {flowError}
                        </div>
                      )}
                    </div>
                  )}
                  <ScoresChart />
                  <div className="mt-8">
                    <div className="font-bold text-lg mb-2">My Joined Yapping Programs</div>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>$FLOW Narrative</li>
                      <li>$TYLO Genesis</li>
                      <li>SocialFi OGs</li>
                    </ul>
                  </div>
                </>
              )}
              {selected === "narratives" && (
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <div className="font-bold text-lg mb-2">My Joined Yapping Programs</div>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      {joinedPrograms.map((prog) => (
                        <li key={prog}>{prog}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 font-bold text-lg">Available Yapping Programs</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {availablePrograms.map((prog) => (
                      <UICard key={prog.key} className="flex flex-col items-center p-4">
                        {prog.logo && <img src={prog.logo} alt={prog.name} className="w-12 h-12 mb-2" />}
                        <UICardHeader className="text-center p-0 mb-2">
                          <UICardTitle className="text-base font-semibold">{prog.name}</UICardTitle>
                        </UICardHeader>
                        <UICardContent className="text-sm text-muted-foreground text-center mb-4 p-0">
                          {prog.description}
                        </UICardContent>
                        <UICardFooter className="flex flex-col items-center w-full p-0">
                          <button
                            className="w-full px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition disabled:opacity-60"
                            onClick={() => { setSelectedProgram(prog.name); setJoinModalOpen(true); }}
                          >
                            Join
                          </button>
                          <div className="text-xs text-muted-foreground mt-2 text-center">
                            Requires <span className="font-bold">10,000 Tylo Token</span> staked
                          </div>
                        </UICardFooter>
                      </UICard>
                    ))}
                  </div>
                  <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Join Yapping Program</DialogTitle>
                        <DialogDescription>
                          {selectedProgram ? (
                            <>
                              To join <span className="font-semibold">{selectedProgram}</span>, you need to stake at least <span className="font-bold">10,000 Tylo Token</span>.<br />
                              (This is a demo. Joining is not enabled yet.)
                            </>
                          ) : null}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <button
                          className="px-4 py-2 rounded bg-muted text-foreground font-semibold border border-input hover:bg-accent transition"
                          onClick={() => setJoinModalOpen(false)}
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
          {/* Right Sidebar: Tylo Score Share, Your Current Situation, Trending, Referral */}
          <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
            {/* Share Tylo Score Card - always visible and prominent */}
            <UICard className="mb-4">
              <UICardHeader>
                <UICardTitle>Share your Tylo Score</UICardTitle>
              </UICardHeader>
              <UICardContent>
                <ShareTyloScoreCard username={username} score={flowScore} />
              </UICardContent>
            </UICard>
            <UICard className="mb-4">
              <UICardHeader>
                <UICardTitle>Your Current Situation</UICardTitle>
              </UICardHeader>
              <UICardContent>
                <div className="mb-2"><span className="font-semibold">Joined Programs:</span></div>
                <ul className="list-disc pl-6 text-sm mb-2">
                  {joinedPrograms.map((prog) => (
                    <li key={prog}>{prog}</li>
                  ))}
                </ul>
                <div className="mb-2"><span className="font-semibold">Status:</span> <span className="text-green-600">Active</span></div>
                <div className="mb-2 text-yellow-700"><span className="font-semibold">Notice:</span> You have pending rewards to claim!</div>
                <div className="mb-2"><span className="font-semibold">Referral Program:</span></div>
                <div className="flex items-center gap-2">
                  <input className="border rounded px-2 py-1 text-xs w-full" value="https://tylo.com/r/your-referral" readOnly />
                  <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText("https://tylo.com/r/your-referral"); toast.success("Referral link copied!");}}>Copy</Button>
                </div>
              </UICardContent>
            </UICard>
            <UICard>
              <UICardHeader>
                <UICardTitle>Trending Narratives</UICardTitle>
              </UICardHeader>
              <UICardContent>
                <ul className="list-disc pl-6 text-sm">
                  <li>$FLOW Narrative</li>
                  <li>Katana Yapping</li>
                  <li>Avax Yapping</li>
                  <li>Virtuals Early</li>
                </ul>
              </UICardContent>
            </UICard>
          </aside>
        </main>
      </div>
    </div>
  );
}

// ShareTyloScoreCard component
function ShareTyloScoreCard({ username, score }: { username?: string; score: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shareText = `Check out my Tylo Score!${username ? ` @${username}` : ""} | Score: ${score} | tylo.com`;

  async function handleShare() {
    if (!cardRef.current) return;
    // Take screenshot of the card
    const canvas = await html2canvas(cardRef.current);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
    if (!blob) return;
    // Create a temporary URL for the image
    const url = URL.createObjectURL(blob);
    // Open Twitter share with image (user will have to upload manually, as Twitter doesn't support direct image upload via intent)
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, "_blank");
    // Optionally, revoke the object URL after some time
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  return (
    <div ref={cardRef} className="rounded-xl border bg-background shadow-lg p-6 flex flex-col items-center max-w-xs mx-auto">
      <div className="text-2xl font-bold mb-2">Tylo Score</div>
      <div className="text-4xl font-extrabold text-primary mb-2">{score}</div>
      <div className="text-muted-foreground mb-4">{username ? `@${username}` : "Anonymous"}</div>
      <Button
        size="sm"
        variant="outline"
        className="mb-2"
        onClick={handleShare}
      >
        Share on Twitter
      </Button>
      <div className="text-xs text-muted-foreground">Let your friends know your Tylo Score!</div>
    </div>
  );
}
