'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu } from 'lucide-react'
import Image from 'next/image'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Features', href: '#features', disabled: false },
    { name: 'How it Works', href: '#how-it-works', disabled: false },
    { name: 'Pricing', href: '#pricing', disabled: true },
    { name: 'About', href: '#about', disabled: true },
  ]

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <div className="flex items-center space-x-2">
                <Image
                  src="/tylo-logo.png"
                  alt="Tylo Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="hidden font-bold sm:inline-block">Tylo</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              item.disabled ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <span className="cursor-not-allowed text-muted-foreground opacity-50">
                      {item.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/tylo-logo.png"
                        alt="Tylo Logo"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <span className="font-bold">Tylo</span>
                    </div>
                    <ThemeToggle />
                  </div>
                  
                  {navigation.map((item) => (
                    item.disabled ? (
                      <span 
                        key={item.name}
                        className="text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed flex items-center justify-between"
                      >
                        {item.name}
                        <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                      </span>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                  
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/signin">Sign In
                        <span className="text-xs ml-2 bg-muted px-2 py-1 rounded">Soon</span>
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/signin">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
} 