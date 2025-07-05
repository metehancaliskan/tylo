"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Github, 
  MessageCircle, 
  Coins, 
  Rocket,
  Gift,
  Code,
  Star,
  Calendar
} from 'lucide-react'

const roadmapItems = [
  {
    quarter: '2025 Q3',
    title: 'Alpha Launch',
    description: 'Early access program with EVM tracking and Twitter integration',
    icon: Rocket,
    type: 'milestone',
    status: 'upcoming',
    features: ['EVM tracking', 'Twitter analysis', 'Basic scoring', 'Alpha onboarding']
  },
  {
    quarter: '2025 Q4',
    title: 'GitHub Integration',
    description: 'Track developer contributions and open source activity',
    icon: Github,
    type: 'feature',
    status: 'upcoming',
    features: ['Repository analysis', 'Commit tracking', 'Code contributions']
  },
  {
    quarter: '2026 Q1',
    title: 'Community Expansion',
    description: 'Scale to 500+ users and expand social tracking platforms',
    icon: MessageCircle,
    type: 'milestone',
    status: 'planned',
    features: ['Telegram groups', 'Discord servers', '500+ users']
  },
  {
    quarter: '2026 Q1',
    title: 'Token Presale',
    description: 'Launch tokenomics and presale for early supporters',
    icon: Coins,
    type: 'milestone',
    status: 'planned',
    features: ['Token presale', 'Governance structure', 'Staking mechanisms']
  },
  {
    quarter: '2026 Q2',
    title: 'Genesis Airdrop',
    description: 'Calculate scores for early adopters and distribute rewards',
    icon: Gift,
    type: 'milestone',
    status: 'planned',
    features: ['Score calculation', 'Airdrop distribution', 'Reward system']
  },
  {
    quarter: '2026 Q2',
    title: 'API Platform',
    description: 'Open developer platform with full API access',
    icon: Code,
    type: 'milestone',
    status: 'planned',
    features: ['Public API', 'Developer docs', 'SDK release']
  }
]

function getStatusStyles() {
  return {
    card: 'border border-muted bg-background',
    icon: 'bg-muted text-muted-foreground',
    badge: 'bg-muted text-muted-foreground'
  }
}

export function Roadmap() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge className="mb-6 bg-muted text-muted-foreground border border-muted">
            <Star className="mr-2 h-4 w-4" />
            Development Roadmap
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Building the Future of Blockchain SocialFi
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our clear timeline from alpha launch to a thriving ecosystem
          </p>
        </div>

        {/* Grid Layout */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmapItems.map((item) => {
              const Icon = item.icon
              const styles = getStatusStyles()

              return (
                <Card 
                  key={`${item.quarter}-${item.title}`} 
                  className={`transition-all duration-300 ${styles.card}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.icon}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge className={`${styles.badge} text-xs px-2 py-1`}>
                        {item.type === 'milestone' ? 'Milestone' : 'Feature'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {item.quarter}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                        {item.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {item.description.includes('FLOW') ? (
                        item.description.split('FLOW').map((part, idx) => (
                          <span key={idx}>
                            {part}
                            {idx < item.description.split('FLOW').length - 1 && (
                              <span className="font-medium">FLOW</span>
                            )}
                          </span>
                        ))
                      ) : (
                        item.description
                      )}
                    </p>

                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Key Features
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.features.map((feature, featureIndex) => (
                          <Badge 
                            key={featureIndex}
                            variant="secondary" 
                            className="text-xs bg-muted/50 hover:bg-muted transition-colors duration-200"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Timeline Overview</h3>
            <p className="text-muted-foreground text-sm">From alpha to full ecosystem launch</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-muted rounded-lg p-4 border border-muted">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Q3 2025</div>
              <div className="text-xs text-muted-foreground">Alpha Launch</div>
            </div>
            <div className="bg-muted rounded-lg p-4 border border-muted">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Q4 2025</div>
              <div className="text-xs text-muted-foreground">GitHub Integration</div>
            </div>
            <div className="bg-muted rounded-lg p-4 border border-muted">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Q1 2026</div>
              <div className="text-xs text-muted-foreground">Community & Token</div>
            </div>
            <div className="bg-muted rounded-lg p-4 border border-muted">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Q2 2026</div>
              <div className="text-xs text-muted-foreground">Airdrop & API</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 