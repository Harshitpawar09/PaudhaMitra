import { useState, useEffect } from "react";
import { Search, Sun, Droplets, Sprout, FlaskConical, Leaf } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Papa from "papaparse";

interface PlantData {
  name: string;
  scientificName: string;
  image: string;
  planting: string;
  watering: string;
  sunlight: string;
  soil: string;
  fertilizer: string;
}

const plantDatabase: Record<string, PlantData> = {
  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "https://images.unsplash.com/photo-1732915169246-272552804bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    planting: "Plant tomato seeds indoors 6-8 weeks before the last frost. Transplant seedlings outdoors when they're 6-10 inches tall and all danger of frost has passed. Space plants 24-36 inches apart in rows 3-4 feet apart.",
    watering: "Water deeply 2-3 times per week, providing 1-2 inches of water weekly. Water at the base of the plant to avoid wetting foliage. Increase watering during fruit development.",
    sunlight: "Full sun (6-8 hours of direct sunlight daily). Tomatoes need plenty of sunlight to produce sweet, flavorful fruit.",
    soil: "Well-draining, nutrient-rich soil with pH 6.0-6.8. Add compost or aged manure before planting. Mulch around plants to retain moisture.",
    fertilizer: "Apply balanced fertilizer (10-10-10) at planting. Switch to low-nitrogen, high-phosphorus fertilizer when flowering begins. Feed every 2-3 weeks during growing season.",
  },
  rose: {
    name: "Rose",
    scientificName: "Rosa spp.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    planting: "Plant bare-root roses in early spring or container roses anytime during growing season. Dig a hole twice as wide as the root ball. Plant with graft union 2 inches above soil in cold climates.",
    watering: "Water deeply once or twice a week, providing 1 inch of water. Water early morning at the base. Avoid overhead watering to prevent disease.",
    sunlight: "Full sun (at least 6 hours daily). Morning sun is ideal as it helps dry dew from leaves.",
    soil: "Rich, well-draining soil with pH 6.0-6.5. Add organic matter like compost. Good drainage is essential to prevent root rot.",
    fertilizer: "Feed with rose-specific fertilizer in early spring when new growth appears. Apply every 4-6 weeks during growing season. Stop feeding 6 weeks before first frost.",
  },
  basil: {
    name: "Basil",
    scientificName: "Ocimum basilicum",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    planting: "Sow seeds indoors 6 weeks before last frost or direct sow after frost danger passes. Plant 10-12 inches apart. Pinch off flower buds to encourage leaf production.",
    watering: "Keep soil consistently moist but not waterlogged. Water deeply when top inch of soil is dry, typically daily in hot weather. Avoid wetting leaves.",
    sunlight: "Full sun (6-8 hours daily). Can tolerate partial shade in hot climates. Provide afternoon shade if temperatures exceed 90°F regularly.",
    soil: "Rich, well-draining soil with pH 6.0-7.0. Good drainage is essential. Raised beds or containers work well.",
    fertilizer: "Apply balanced liquid fertilizer every 2-4 weeks. Do not over-fertilize as this reduces flavor. Use fish emulsion or compost tea for organic approach.",
  },
  monstera: {
    name: "Monstera",
    scientificName: "Monstera deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    planting: "Plant in a well-draining pot with drainage holes. Choose a pot 2 inches larger than the root ball. Repot every 2 years as the plant grows.",
    watering: "Water when the top 1-2 inches of soil are dry. Reduce watering in winter. Mist leaves occasionally or use a humidifier for humidity.",
    sunlight: "Bright indirect light. Avoid direct sun which can scorch leaves. Can tolerate lower light but growth will slow.",
    soil: "Well-draining mix of peat, perlite, and orchid bark. pH 5.5-6.5. Good aeration is key to prevent root rot.",
    fertilizer: "Feed monthly with balanced liquid fertilizer during spring and summer. Skip fertilizing in fall and winter.",
  },
  lavender: {
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    planting: "Plant in spring after frost danger has passed. Space 18-24 inches apart. Slightly raised beds improve drainage and help the plant thrive.",
    watering: "Water deeply but infrequently, once established. Allow soil to dry out between waterings. Overwatering is the most common cause of lavender death.",
    sunlight: "Full sun (6-8 hours daily). Lavender loves heat and light. Poor sunlight leads to leggy growth and fewer blooms.",
    soil: "Well-draining, slightly alkaline soil (pH 6.5-7.5). Sandy or gravelly soil is ideal. Avoid rich, organic soils.",
    fertilizer: "Minimal fertilizing needed. Light application of slow-release fertilizer in spring is sufficient. Too much nitrogen reduces flower production.",
  },
};

export function PlantGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/dataset/Indoor_Plant_Health_and_Growth_Factors.csv")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch CSV");
        return response.text();
      })
      .then((csvString) => {
        const results = Papa.parse<Record<string, string>>(csvString, {
          header: true,
          skipEmptyLines: true,
        });
        setCsvData(results.data);
      })
      .catch((err) => console.log("CSV not available:", err));
  }, []);

  const searchPlant = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    setNotFound(false);
    setPlantData(null);

    const dbMatch = Object.entries(plantDatabase).find(([key, plant]) =>
      key.includes(query) || plant.name.toLowerCase().includes(query)
    );

    if (dbMatch) {
      setPlantData(dbMatch[1]);
      return;
    }

    if (csvData.length > 0) {
      const csvMatch = csvData.find(
        (row) =>
          row.Plant_ID && row.Plant_ID.toLowerCase().includes(query)
      );

      if (csvMatch) {
        setPlantData({
          name: csvMatch.Plant_ID || query,
          scientificName: csvMatch.Species || "",
          image: `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080`,
          planting: `Plant in well-prepared soil. Optimal temperature: ${csvMatch.Room_Temperature_C || "20-25"}°C.`,
          watering: `Water every ${csvMatch.Watering_Frequency_days || "3-5"} days with approximately ${csvMatch.Watering_Amount_ml || "200"}ml.`,
          sunlight: csvMatch.Sunlight_Exposure || "Moderate indirect light recommended.",
          soil: `Maintain soil moisture around ${csvMatch["Soil_Moisture_%"] || "50"}%.`,
          fertilizer: `Fertilizer usage: ${csvMatch.Fertilizer_Used === "Yes" ? "Regular fertilization recommended" : "Minimal fertilization needed"}.`,
        });
        return;
      }
    }

    setNotFound(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchPlant();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plant Care Guide
          </h1>
          <p className="text-lg text-foreground/70">
            Search for detailed care instructions for your plants
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search for a plant (e.g., tomato, rose, basil)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
            <button
              onClick={searchPlant}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-md"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-foreground/60">Try:</span>
            {["Tomato", "Rose", "Basil", "Monstera", "Lavender"].map((plant) => (
              <button
                key={plant}
                onClick={() => {
                  setSearchQuery(plant.toLowerCase());
                  const key = plant.toLowerCase();
                  if (plantDatabase[key]) {
                    setPlantData(plantDatabase[key]);
                    setNotFound(false);
                  }
                }}
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                {plant}
              </button>
            ))}
          </div>
        </div>

        {notFound && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <Leaf className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Plant Not Found</h3>
            <p className="text-foreground/60">
              We don't have information for "{searchQuery}" yet. Try searching for tomato, rose, basil, monstera, or lavender.
            </p>
          </div>
        )}

        {plantData && (
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {plantData.image && (
              <div className="h-64 overflow-hidden">
                <ImageWithFallback
                  src={plantData.image}
                  alt={plantData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">{plantData.name}</h2>
                {plantData.scientificName && (
                  <p className="text-foreground/60 italic">{plantData.scientificName}</p>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Planting Instructions</h3>
                    <p className="text-foreground/70 leading-relaxed">{plantData.planting}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Watering Schedule</h3>
                    <p className="text-foreground/70 leading-relaxed">{plantData.watering}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sun className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Sunlight Requirement</h3>
                    <p className="text-foreground/70 leading-relaxed">{plantData.sunlight}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Soil Type</h3>
                    <p className="text-foreground/70 leading-relaxed">{plantData.soil}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Fertilizer Recommendation</h3>
                    <p className="text-foreground/70 leading-relaxed">{plantData.fertilizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
