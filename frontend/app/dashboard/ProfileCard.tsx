"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import type { LinkedAccountWithMetadata, WalletWithMetadata } from "@privy-io/react-auth";

interface ProfileCardProps {
  username?: string;
  email?: string;
  xProfileImage?: string;
  isXConnected?: boolean;
  onLinkEmail: () => void;
  onLinkWallet: () => void;
  onLogout: () => void;
  walletAddress?: string;
  linkedAccounts?: LinkedAccountWithMetadata[];
  linkedWallets?: Array<{ address?: string; wallet_client?: string }>;
}

// Type guards for account types
function isTwitterAccount(acc: LinkedAccountWithMetadata): boolean {
  return acc.type === "twitter_oauth" && typeof (acc as { username?: string }).username === "string";
}
function isWallet(acc: LinkedAccountWithMetadata): acc is WalletWithMetadata {
  return acc.type === "wallet" && typeof (acc as WalletWithMetadata).address === "string";
}

export function ProfileCard({
  username,
  email,
  xProfileImage,
  isXConnected,
  onLinkEmail,
  onLinkWallet,
  onLogout,
  walletAddress,
  linkedAccounts = [],
  linkedWallets = [],
}: ProfileCardProps) {
  return (
    <Card className="mb-8 w-full max-w-4xl flex flex-row items-center p-6 gap-6">
      <div className="flex items-center gap-6 flex-1">
        <Avatar className="w-20 h-20 text-3xl">
          {xProfileImage ? (
            <AvatarImage src={xProfileImage} alt={username || email || "User"} />
          ) : (
            <AvatarFallback>{username?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "?"}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-2xl">{username || email || "Anonymous"}</div>
          <div className="text-muted-foreground text-sm">
            {isXConnected ? "Connected to X (Twitter)" : "Not connected to X (Twitter)"}
          </div>
          {walletAddress && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Wallet:</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              <Button
                size="icon"
                variant="ghost"
                className="p-1"
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                title="Copy address"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6.75A2.25 2.25 0 0 0 14.25 4.5h-6A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5h6A2.25 2.25 0 0 0 16.5 17.25v-1.5M9.75 15.75h6A2.25 2.25 0 0 0 18 13.5v-6A2.25 2.25 0 0 0 15.75 5.25h-6A2.25 2.25 0 0 0 7.5 7.5v6a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </Button>
            </div>
          )}
          {linkedAccounts && linkedAccounts.length > 0 && (
            <div className="flex flex-col gap-1 mt-2">
              <div className="font-semibold text-sm text-muted-foreground mb-1">Linked Accounts:</div>
              <div className="flex flex-wrap gap-2">
                {linkedAccounts.map((acc, i) => {
                  if (isTwitterAccount(acc)) {
                    return (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 bg-muted rounded text-xs">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.07 9.03a12.72 12.72 0 0 1-9.24-4.684a4.48 4.48 0 0 0 1.39 5.98a4.44 4.44 0 0 1-2.03-.56v.057a4.48 4.48 0 0 0 3.6 4.39a4.5 4.5 0 0 1-2.02.077a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.77c0-.19-.01-.38-.02-.57a9.22 9.22 0 0 0 2.26-2.34z"/></svg>
                        <span>@{isTwitterAccount(acc) && typeof (acc as { username?: string }).username === 'string' ? (acc as { username: string }).username : ''}</span>
                      </div>
                    );
                  }
                  if (isWallet(acc)) {
                    return (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 bg-muted rounded text-xs font-mono">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M8 11h4"/><path d="M15 17v2"/></svg>
                        <span>{acc.address ? acc.address.slice(0, 6) + "..." + acc.address.slice(-4) : "Wallet"}</span>
                        {acc.walletClientType && acc.walletClientType !== "privy" && (
                          <span className="bg-green-100 text-green-700 px-1 rounded ml-1">{acc.walletClientType}</span>
                        )}
                        {acc.walletClientType === "privy" && (
                          <span className="bg-gray-100 text-gray-700 px-1 rounded ml-1">Privy</span>
                        )}
                      </div>
                    );
                  }
                  // Add more account types as needed
                  return null;
                })}
              </div>
            </div>
          )}
          {linkedWallets.length > 0 && (
            <div className="flex flex-col gap-1 mt-2">
              <div className="font-semibold text-sm text-muted-foreground mb-1">Linked Wallets:</div>
              <div className="flex flex-wrap gap-2">
                {linkedWallets.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 bg-muted rounded text-xs font-mono">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M8 11h4"/><path d="M15 17v2"/></svg>
                    <span>{w.address ? w.address.slice(0, 6) + "..." + w.address.slice(-4) : "Wallet"}</span>
                    {w.wallet_client && w.wallet_client !== "privy" && (
                      <span className="bg-green-100 text-green-700 px-1 rounded ml-1">{w.wallet_client}</span>
                    )}
                    {w.wallet_client === "privy" && (
                      <span className="bg-gray-100 text-gray-700 px-1 rounded ml-1">Privy</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Button variant="outline" onClick={onLinkEmail}>Link Email</Button>
        <Button variant="outline" onClick={onLinkWallet}>Link Wallet</Button>
        <Button variant="destructive" onClick={onLogout} className="mt-2">Logout</Button>
      </div>
    </Card>
  );
} 