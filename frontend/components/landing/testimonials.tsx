import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    content: "Tylo's AI-powered scoring completely transformed how I understand my social influence in the Web3 space. The insights are incredibly accurate and actionable.",
    author: {
      name: "Alex Chen",
      role: "DeFi Protocol Founder",
      company: "FlowSwap",
      avatar: "/api/placeholder/32/32",
      initials: "AC"
    },
    rating: 5,
    featured: true
  },
  {
    content: "The Web3 + Web2 integration is seamless. Finally, a platform that understands the full spectrum of my digital presence.",
    author: {
      name: "Sarah Rodriguez",
      role: "Community Manager",
      company: "FLOW Foundation",
      avatar: "/api/placeholder/32/32",
      initials: "SR"
    },
    rating: 5,
    featured: false
  },
  {
    content: "As a content creator in the crypto space, Tylo helps me optimize my strategy across all platforms. The AI recommendations are spot-on.",
    author: {
      name: "Marcus Johnson",
      role: "Crypto Influencer",
      company: "@CryptoMarcus",
      avatar: "/api/placeholder/32/32",
      initials: "MJ"
    },
    rating: 5,
    featured: false
  },
  {
    content: "The real-time scoring feature keeps me motivated to maintain consistent engagement. It's like having a personal social media coach.",
    author: {
      name: "Emily Zhang",
      role: "Web3 Developer",
      company: "Blocto",
      avatar: "/api/placeholder/32/32",
      initials: "EZ"
    },
    rating: 5,
    featured: true
  },
  {
    content: "Tylo's privacy-first approach gives me confidence that my data is secure while still getting powerful insights.",
    author: {
      name: "David Kim",
      role: "NFT Artist",
      company: "Independent",
      avatar: "/api/placeholder/32/32",
      initials: "DK"
    },
    rating: 5,
    featured: false
  },
  {
    content: "The FLOW EVM integration is flawless. It's clear this platform was built specifically for our ecosystem.",
    author: {
      name: "Lisa Wang",
      role: "Product Manager",
      company: "Dapper Labs",
      avatar: "/api/placeholder/32/32",
      initials: "LW"
    },
    rating: 5,
    featured: false
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-6">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Web3 professionals
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join thousands of users who are already leveraging Tylo to grow their social influence and unlock new opportunities in the Web3 ecosystem.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  testimonial.featured 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                    : ''
                }`}
              >
                {testimonial.featured && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <StarRating rating={testimonial.rating} />
                    <Quote className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <blockquote className="text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={testimonial.author.avatar} 
                        alt={testimonial.author.name} 
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {testimonial.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.author.role}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {testimonial.author.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50M+</div>
              <div className="text-sm text-muted-foreground">Data Points Analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 