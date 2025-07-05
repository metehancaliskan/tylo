import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, UserPlus, Brain, Code, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Data Collection',
    description: 'We collect your public social media and Web3 wallet data to build a comprehensive profile.',
    icon: UserPlus,
    color: '',
    audience: 'users'
  },
  {
    number: '02',
    title: 'AI Agent Generates Score',
    description: 'Our AI agent analyzes your combined data and generates a unique reputation score.',
    icon: Brain,
    color: '',
    audience: 'system'
  },
  {
    number: '03',
    title: 'Apps Integrate API',
    description: 'Apps use our API to access up-to-date reputation scores for trust-based features and decision making.',
    icon: Code,
    color: '',
    audience: 'developers'
  },
  {
    number: '04',
    title: 'Scores Updated Daily',
    description: 'Your reputation score is refreshed daily as your social and on-chain activity evolves, powering a dynamic ecosystem.',
    icon: Rocket,
    color: '',
    audience: 'ecosystem'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-6">
            Two-Sided Marketplace
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How Tylo Powers Blockchain Reputation
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A sustainable model where users get valuable reputation scores for free, while apps get the infrastructure they need to build trust-based features.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1
              
              return (
                <div key={step.number} className="relative">
                  <Card className="relative h-full overflow-hidden border border-muted bg-background">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded bg-muted">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">
                        STEP {step.number}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="mt-4 text-xs"
                      >
                        {step.audience === 'users' && 'For Users'}
                        {step.audience === 'developers' && 'For Developers'}
                        {step.audience === 'system' && 'AI System'}
                        {step.audience === 'ecosystem' && 'Network Effect'}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow connector for desktop */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-green-600" />
                  <span>For Users: Always Free</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect your accounts, get your comprehensive SocialFi score, and use it across the entire ecosystem. No hidden fees, no subscriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-flow-green/10 to-flow-green-dark/10 dark:from-flow-green/5 dark:to-flow-green-dark/5 border-flow-green/30 dark:border-flow-green/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5 flow-green" />
                  <span>For Apps: Powerful API</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrate reputation-based features in minutes. Pay only for what you use with transparent, developer-friendly pricing for apps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to join the ecosystem?</h3>
          <p className="text-muted-foreground mb-8">
            Whether you&apos;re a user looking to build your reputation or a developer wanting to integrate trust features, we&apos;ve got you covered.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700">
              Get My Free Score
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-flow-green bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-flow-green/10 flow-green">
              <Code className="mr-2 h-4 w-4" />
              View API Docs
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 