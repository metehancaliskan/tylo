"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import React from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (authenticated) {
      router.push("/dashboard");
    }
  }, [authenticated, router]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background to-muted/60">
      {/* Left side: Logo and pitch */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-background border-r">
        <Image
          src="/tylo-logo.png"
          alt="Tylo Logo"
          width={80}
          height={80}
          className="mb-8 rounded shadow-lg"
        />
        <h1 className="text-3xl font-bold mb-4">Tylo</h1>
        <p className="text-lg text-muted-foreground max-w-xs text-center">
          Blockchain & Social Media Reputation Scores. <br />
          Unlock trust, build your Web3 identity.
        </p>
      </div>
      {/* Right side: Privy login */}
      <div className="flex flex-1 flex-col justify-center items-center w-full md:w-1/2 bg-background">
        <Card className="w-full max-w-md p-0 rounded-2xl border bg-card shadow-2xl relative overflow-hidden">
          <CardHeader className="flex flex-col items-center gap-2 pt-10 pb-4">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-center">Sign in to Tylo</h2>
            <p className="text-base text-muted-foreground text-center max-w-xs">Access your SocialFi dashboard and unlock your blockchain reputation.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-8 pb-2 pt-2">
            <button
              className="w-full py-4 px-4 rounded-lg flex items-center justify-center gap-3 bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition cursor-pointer border border-neutral-800 focus:ring-2 focus:ring-primary focus:outline-none"
              onClick={() => login({ loginMethods: ["twitter"] })}
              disabled={!ready || authenticated}
            >
              <Image
                src={resolvedTheme === "dark" ? "/x-logo-white.png" : "/x-logo-black.png"}
                alt="X Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              Login with X
            </button>
            <Separator />
            <div className="flex flex-col items-center gap-2 mt-2">
              <Image
                src={resolvedTheme === "dark" ? "/privy-white.png" : "/privy-black.png"}
                alt="Privy Logo"
                width={90}
                height={32}
                className="drop-shadow-md"
                priority
              />
              <Badge variant="secondary" className="text-xs px-3 py-1 mt-1 bg-primary/10 text-primary border-primary/20 font-semibold tracking-wide uppercase">Secured by Privy</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 pb-8 pt-2">
            <span className="text-xs text-muted-foreground text-center">Your login is private and secure. We never post or share without your permission.</span>
          </CardFooter>
          {/* Decorative gradient accent */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-primary/30 to-primary/0 rounded-full blur-2xl opacity-60 pointer-events-none" />
        </Card>
      </div>
    </div>
  );
}
