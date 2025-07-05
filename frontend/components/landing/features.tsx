import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Globe, 
  Shield, 
  BarChart3, 
  Users, 
  Wallet, 
  Network,
  TrendingUp,
  Code,
  Clock
} from 'lucide-react'

const features = [
  {
    title: 'Developer API Access',
    description: 'Apps integrate our RESTful API to access user reputation scores with simple authentication and real-time data.',
    icon: Code,
    badge: 'API First'
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze cross-platform behavior to generate accurate, trustworthy reputation scores.',
    icon: Brain,
    badge: 'AI Core'
  },
  {
    title: 'Web3 + Web2 Integration',
    description: 'Combines traditional social media activity with on-chain behavior for the most comprehensive reputation system.',
    icon: Globe,
    badge: 'Hybrid Data'
  },
  {
    title: 'Real-time Updates',
    description: 'Scores update in real-time as user activity changes, ensuring apps always have the most current reputation data.',
    icon: TrendingUp,
    badge: 'Live Data'
  },
  {
    title: 'Privy Wallet Security',
    description: 'Secure wallet connection and authentication powered by Privy with enterprise-grade privacy protection.',
    icon: Shield,
    badge: 'Secure'
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Track influence across Twitter, Discord, Telegram, GitHub, and all major DeFi protocols and NFT platforms.',
    icon: BarChart3,
    badge: 'Multi-Platform'
  },
  {
    title: 'Instant Integration',
    description: 'Simple SDK and webhooks allow apps to integrate reputation scoring in minutes, not weeks.',
    icon: Clock,
    badge: 'Quick Setup'
  },
  {
    title: 'Social Graph Mapping',
    description: 'Advanced network analysis reveals user connections, community influence, and collaboration patterns.',
    icon: Network,
    badge: 'Graph Analysis'
  },
  {
    title: 'Multi-Chain Support',
    description: 'Connect unlimited wallets across EVM and other chains for complete on-chain reputation tracking.',
    icon: Wallet,
    badge: 'Multi-Chain'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The reputation layer for blockchain and social media
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A complete SocialFi infrastructure that gives users free reputation scores while providing developers with powerful APIs to build trust-based applications.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.title} 
                  className={`relative overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div 
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10`}
                      >
                        <Icon 
                          className={`h-5 w-5 text-primary`} 
                        />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs`}
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Two-sided value proposition */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    For Users
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Free Reputation Building</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Connect social accounts and wallets for free</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Get comprehensive SocialFi reputation score</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Use your score across all apps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Secure wallet connection with Privy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-flow-green/20 bg-flow-green/5 dark:bg-flow-green/10">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Code className="h-6 w-6 flow-green" />
                  <Badge variant="outline" className="border-flow-green flow-green">
                    For Developers
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Powerful API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-flow-green flex-shrink-0" />
                    <span>RESTful API with comprehensive documentation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-flow-green flex-shrink-0" />
                    <span>Real-time webhooks for score updates</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-flow-green flex-shrink-0" />
                    <span>SDK for popular frameworks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-flow-green flex-shrink-0" />
                    <span>Flexible pricing based on usage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
} 