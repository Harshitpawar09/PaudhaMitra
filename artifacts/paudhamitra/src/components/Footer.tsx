import { Leaf, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-semibold">PaudhaMitra</span>
            </div>
            <p className="text-primary-foreground/90 leading-relaxed">
              Your smart gardening companion. Detect plant diseases, learn how to grow plants, and get intelligent watering suggestions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/90 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/disease-detection" className="text-primary-foreground/90 hover:text-white transition-colors">
                Disease Detection
              </Link>
              <Link to="/plant-guide" className="text-primary-foreground/90 hover:text-white transition-colors">
                Plant Guide
              </Link>
              <Link to="/watering-suggestion" className="text-primary-foreground/90 hover:text-white transition-colors">
                Watering Suggestion
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-primary-foreground/80">
          <p>&copy; 2026 PaudhaMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
