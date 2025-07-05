import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 max-w-3xl">
          Build Your Web3 Reputation
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl">
          Get your social reputation score for free. Integrate our API to unlock trust in your blockchain app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
          <Button size="lg" className="flex-1">
            Get My Free Score
          </Button>
          <Button size="lg" variant="outline" className="flex-1">
            View API Docs
          </Button>
        </div>
      </div>
    </section>
  )
} 