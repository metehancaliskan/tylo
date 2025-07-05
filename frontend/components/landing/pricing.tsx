import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Mail, MessageCircle } from 'lucide-react'

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <MessageCircle className="mr-2 h-4 w-4" />
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Enterprise Solutions for Blockchain Apps
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Custom API integration and pricing for blockchain and social media applications. Contact us to discuss your specific needs.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60"></div>
            
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Enterprise Integration</CardTitle>
              <p className="text-muted-foreground mt-2">
                Custom API solutions for blockchain apps
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Custom API endpoints</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Real-time data access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Dedicated infrastructure</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Custom rate limits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Integration consulting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">SLA guarantee</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">Custom Pricing</div>
                    <p className="text-sm text-muted-foreground">Based on your integration needs</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/80 text-white"
                      asChild
                    >
                      <a href="mailto:enterprise@tylo.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Sales
                      </a>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary/10"
                      asChild
                    >
                      <a href="https://calendly.com/tylo" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Schedule Call
                      </a>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll get back to you within 24 hours to discuss your integration requirements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Early Access Note */}
        <div className="mx-auto max-w-2xl mt-12">
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="text-center py-8">
              <h3 className="font-semibold mb-2">Early Access Opportunity</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our waitlist to be among the first 500 users and get priority access to enterprise features when they launch in 2026 Q2.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#hero">Join Waitlist</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 