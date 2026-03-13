import { Leaf, Target, Users, Heart } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-2xl mb-6">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About PaudhaMitra
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Your trusted companion in the journey of plant care and gardening
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                PaudhaMitra was created with a simple yet powerful mission: to make plant care accessible and enjoyable for everyone, from beginners to experienced gardeners.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                We believe that technology can bridge the gap between plant enthusiasts and expert knowledge, helping you grow healthier plants and create beautiful green spaces.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            What We Offer
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Disease Detection</h3>
                <p className="text-foreground/70">
                  Upload a photo of your plant and let our advanced Keras AI model identify diseases and suggest treatments instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Comprehensive Plant Guides</h3>
                <p className="text-foreground/70">
                  Access detailed care instructions for a wide variety of plants, including planting tips, watering schedules, sunlight needs, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Smart Watering Recommendations</h3>
                <p className="text-foreground/70">
                  Get personalized watering suggestions based on real-time weather data, ensuring your plants get exactly what they need.
                </p>
              </div>
            </div>
          </div>
        </div>

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
    </div>
  );
}
