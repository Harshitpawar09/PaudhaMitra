import { useState, useEffect } from "react";
import { Droplets, Cloud, ThermometerSun, Calendar, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface WateringResult {
  temperature: number;
  weatherCondition: string;
  recommendation: string;
  shouldWater: boolean;
}

export function WateringSuggestion() {
  const [plantName, setPlantName] = useState("");
  const [lastWatered, setLastWatered] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<WateringResult | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plantName || !lastWatered || !location) {
      return;
    }

    const query = plantName.toLowerCase().trim();
    const csvMatch = csvData.find(
      (row) => row.Plant_ID && row.Plant_ID.toLowerCase().includes(query)
    );

    if (csvMatch) {
      const freq = parseInt(csvMatch.Watering_Frequency_days) || 3;
      const amount = csvMatch.Watering_Amount_ml;
      const soilMoisture = parseFloat(csvMatch["Soil_Moisture_%"]) || 50;

      const shouldWater = soilMoisture < 40;

      setResult({
        temperature: parseFloat(csvMatch.Room_Temperature_C) || 22,
        weatherCondition: csvMatch.Sunlight_Exposure || "Indoor",
        shouldWater,
        recommendation: shouldWater
          ? `Based on your plant's data, it needs ${amount}ml of water. Current soil moisture is low (${soilMoisture}%).`
          : `Your plant's soil moisture is healthy (${soilMoisture}%). Next scheduled watering is in ${freq} days.`,
      });
    } else {
      const mockWeatherData: WateringResult[] = [
        {
          temperature: 28,
          weatherCondition: "Sunny",
          recommendation:
            "Water your plant today. The weather is hot and sunny, which increases water evaporation.",
          shouldWater: true,
        },
        {
          temperature: 22,
          weatherCondition: "Cloudy",
          recommendation:
            "You can skip watering today. The cloudy weather reduces water loss. Water your plant tomorrow if soil feels dry.",
          shouldWater: false,
        },
        {
          temperature: 18,
          weatherCondition: "Rainy",
          recommendation:
            "Rain expected tomorrow. Water your plant after 2 days. The rainfall will provide sufficient moisture.",
          shouldWater: false,
        },
      ];
      const randomResult =
        mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
      setResult(randomResult);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Watering Suggestion
          </h1>
          <p className="text-lg text-foreground/70">
            Get personalized watering recommendations based on weather conditions
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-foreground/70">
                <span className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Plant Name
                </span>
              </label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g., Tomato, Rose, Basil"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground/70">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Watered Date
                </span>
              </label>
              <input
                type="date"
                value={lastWatered}
                onChange={(e) => setLastWatered(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground/70">
                <span className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Location / City
                </span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              Get Watering Suggestion
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <h2 className="text-xl font-bold mb-6 text-foreground">
              Watering Recommendation
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-muted/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <ThermometerSun className="w-5 h-5 text-primary" />
                  <span className="text-foreground/70 text-sm">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.temperature}°C
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  <span className="text-foreground/70 text-sm">Condition</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.weatherCondition}
                </p>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 ${
                result.shouldWater
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Droplets
                  className={`w-6 h-6 mt-0.5 ${
                    result.shouldWater ? "text-blue-600" : "text-green-600"
                  }`}
                />
                <div>
                  <p
                    className={`font-semibold mb-1 ${
                      result.shouldWater ? "text-blue-800" : "text-green-800"
                    }`}
                  >
                    {result.shouldWater ? "Water Your Plant Today" : "No Watering Needed"}
                  </p>
                  <p
                    className={
                      result.shouldWater ? "text-blue-700" : "text-green-700"
                    }
                  >
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-foreground/60">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Always check the soil moisture before watering. Stick your finger 1-2 inches into the soil — if it feels dry, water the plant.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
