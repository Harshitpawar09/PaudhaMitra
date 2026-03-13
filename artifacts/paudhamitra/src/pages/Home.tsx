import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Scan, BookOpen, Droplets, ArrowRight, Users, Leaf } from "lucide-react";

export function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Your Smart Gardening Companion
              </h1>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Detect plant diseases, learn how to grow plants, and get smart watering suggestions based on weather.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/disease-detection"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  <Scan className="w-5 h-5" />
                  Detect Plant Disease
                </Link>
                <Link
                  to="/plant-guide"
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore Plant Guide
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1552670070-7901ae9ffce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Healthy plants in garden"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-xl hidden md:block">
                <p className="font-semibold">Grow with confidence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Plant Care
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to keep your plants healthy and thriving
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1728297753604-d2e129bdb226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Plant disease detection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Scan className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Disease Detection</h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Upload a photo of your plant and our AI model will instantly identify diseases and provide treatment recommendations.
                </p>
                <Link
                  to="/disease-detection"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Try it now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Plant guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Plant Care Guide</h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Access detailed care instructions for a wide variety of plants, including planting tips, watering schedules, and sunlight needs.
                </p>
                <Link
                  to="/plant-guide"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Explore guides <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1504977330965-c2ae88a2dc44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Smart watering"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Watering</h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Get personalized watering recommendations based on your plant type, weather conditions, and soil moisture data.
                </p>
                <Link
                  to="/watering-suggestion"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Get suggestions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">16+</p>
              <p className="text-foreground/70">Plant Diseases Detected</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">AI</p>
              <p className="text-foreground/70">Powered Analysis</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">Free</p>
              <p className="text-foreground/70">Plant Care Guides</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl shadow-lg border border-border p-8">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  PaudhaMitra is more than just a platform - it's a community of plant lovers helping each other grow. Whether you're nurturing your first succulent or managing a full garden, we're here to support you every step of the way.
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  Together, we can make the world a greener place, one plant at a time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-foreground/70 italic">
                "Growing together, nurturing nature"
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
