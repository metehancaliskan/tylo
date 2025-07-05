"use client";

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, TrendingUp, Users, Code, Zap } from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function Hero() {
  const { authenticated } = usePrivy();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-8 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Free for Users • Essential for Blockchain Apps
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            The Social Reputation Layer for Blockchain Apps
            <span className="text-primary block">SocialFi Scoring Standard</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Users get their social reputation scores for free. Apps integrate our API to access comprehensive Web3 + Web2 social intelligence powered by AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {authenticated ? (
              <Button size="lg" className="px-8" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" className="px-8" asChild>
                <Link href="/signin">
                  Get My Score Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="px-8">
                  <Code className="mr-2 h-4 w-4" />
                  API Documentation
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-center">
                <div className="font-semibold mb-1">Coming Soon</div>
                <div className="text-sm text-muted-foreground">API documentation will be available soon.</div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">2025</div>
              <div className="text-sm text-muted-foreground">Launch Year</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">Q4 2025</div>
              <div className="text-sm text-muted-foreground">API Launch</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Target Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm text-muted-foreground">Platforms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flowing Lines Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main flowing lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-40 dark:opacity-30"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
        >
          <defs>
            <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00EF8B" stopOpacity="0" />
              <stop offset="50%" stopColor="#00EF8B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00EF8B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#02D87E" stopOpacity="0" />
              <stop offset="50%" stopColor="#02D87E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#02D87E" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Flowing line 1 */}
          <path
            d="M-200,200 Q300,100 600,200 T1400,200"
            stroke="url(#flowGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          
          {/* Flowing line 2 */}
          <path
            d="M-200,350 Q400,250 800,350 T1400,350"
            stroke="url(#flowGradient2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '3s' }}
          />
          
          {/* Flowing line 3 */}
          <path
            d="M-200,500 Q500,400 900,500 T1400,500"
            stroke="url(#flowGradient1)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s', animationDuration: '4s' }}
          />
        </svg>

        {/* Floating dots with FLOW colors */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-flow-green/40 dark:bg-flow-green/30 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-flow-green-dark/30 dark:bg-flow-green-dark/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-flow-green/50 dark:bg-flow-green/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-flow-green-dark/35 dark:bg-flow-green-dark/25 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        
        {/* Subtle grid pattern with FLOW green */}
        <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(#00EF8B 1px, transparent 1px),
            linear-gradient(90deg, #00EF8B 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Original background decoration (kept but reduced opacity) */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>
    </section>
  )
} 