import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tylo - AI-Powered SocialFi Scoring for Blockchain & EVM",
  description: "Unlock your social influence power with our revolutionary platform that combines Web3 and Web2 data to create comprehensive SocialFi scores powered by advanced AI algorithms.",
  keywords: ["SocialFi", "EVM", "Web3", "AI", "Social Scoring", "Blockchain", "DeFi"],
  authors: [{ name: "Tylo Team" }],
  creator: "Tylo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tylo.com",
    title: "Tylo - AI-Powered SocialFi Scoring for Blockchain & EVM",
    description: "Unlock your social influence power with Web3 + Web2 integrated SocialFi scoring powered by AI",
    siteName: "Tylo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tylo - AI-Powered SocialFi Scoring for Blockchain & EVM",
    description: "Unlock your social influence power with Web3 + Web2 integrated SocialFi scoring powered by AI",
    creator: "@tylo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
