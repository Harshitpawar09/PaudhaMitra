import { useState, useEffect } from "react";
import {
  Droplets,
  Cloud,
  ThermometerSun,
  Calendar,
  AlertCircle,
  Wind,
  Loader2,
  MapPin,
  Info,
} from "lucide-react";
import Papa from "papaparse";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  description: string;
  windSpeed: number;
  cityName: string;
  icon: string;
}

interface WateringResult {
  weather: WeatherData;
  baseFrequencyDays: number;
  adjustedFrequencyDays: number;
  adjustments: { reason: string; delta: number }[];
  daysSinceLastWatered: number;
  shouldWater: boolean;
  urgency: "now" | "soon" | "later";
  recommendation: string;
  waterAmountMl: number | null;
}

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;

async function fetchWeather(city: string): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found. Try a different city name.`);
    if (res.status === 401) throw new Error("Invalid API key. Please check your VITE_WEATHER_API_KEY.");
    throw new Error(`Weather fetch failed (${res.status})`);
  }
  const data = await res.json();
  return {
    temperature: Math.round(data.main.temp * 10) / 10,
    feelsLike: Math.round(data.main.feels_like * 10) / 10,
    humidity: data.main.humidity,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    cityName: data.name + (data.sys?.country ? `, ${data.sys.country}` : ""),
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

/**
 * Adjusts the baseline watering frequency based on live weather.
 *
 * Rules (negative delta = water sooner, positive = delay):
 *  Temperature:
 *    > 38°C  → −2 days  (very hot, high evaporation)
 *    > 32°C  → −1 day
 *    > 25°C  → −0.5 day
 *    < 15°C  → +1 day   (cool, slower evaporation)
 *    < 10°C  → +2 days
 *
 *  Humidity:
 *    < 25%   → −1.5 days (very dry air)
 *    < 40%   → −0.75 day
 *    > 70%   → +1 day    (humid, plants dry slowly)
 *    > 85%   → +1.5 days
 *
 *  Weather condition:
 *    Rain / Drizzle / Thunderstorm → +2 days
 *    Snow                          → +3 days
 *    Clouds                        → +0.5 day
 *    Clear / sunny & temp > 28     → −0.5 day
 *
 *  Wind:
 *    > 8 m/s → −0.5 day (wind dries soil faster)
 */
function computeWateringAdjustments(
  baseFreq: number,
  weather: WeatherData
): { adjustedFreq: number; adjustments: { reason: string; delta: number }[] } {
  const adjustments: { reason: string; delta: number }[] = [];

  // Temperature
  if (weather.temperature > 38) {
    adjustments.push({ reason: "Extreme heat (>38°C) accelerates evaporation", delta: -2 });
  } else if (weather.temperature > 32) {
    adjustments.push({ reason: "Hot weather (>32°C) increases water loss", delta: -1 });
  } else if (weather.temperature > 25) {
    adjustments.push({ reason: "Warm weather (>25°C) speeds up evaporation", delta: -0.5 });
  } else if (weather.temperature < 10) {
    adjustments.push({ reason: "Cold weather (<10°C) slows evaporation", delta: 2 });
  } else if (weather.temperature < 15) {
    adjustments.push({ reason: "Cool weather (<15°C) reduces water needs", delta: 1 });
  }

  // Humidity
  if (weather.humidity < 25) {
    adjustments.push({ reason: "Very low humidity (<25%) dries soil quickly", delta: -1.5 });
  } else if (weather.humidity < 40) {
    adjustments.push({ reason: "Low humidity (<40%) increases soil drying", delta: -0.75 });
  } else if (weather.humidity > 85) {
    adjustments.push({ reason: "Very high humidity (>85%) slows drying", delta: 1.5 });
  } else if (weather.humidity > 70) {
    adjustments.push({ reason: "High humidity (>70%) reduces watering needs", delta: 1 });
  }

  // Weather condition
  const cond = weather.condition.toLowerCase();
  if (["rain", "drizzle", "thunderstorm"].includes(cond)) {
    adjustments.push({ reason: `${weather.description} provides natural moisture`, delta: 2 });
  } else if (cond === "snow") {
    adjustments.push({ reason: "Snow provides moisture, cold slows evaporation", delta: 3 });
  } else if (cond === "clouds") {
    adjustments.push({ reason: "Overcast skies reduce evaporation slightly", delta: 0.5 });
  } else if (cond === "clear" && weather.temperature > 28) {
    adjustments.push({ reason: "Clear & warm sky increases evaporation", delta: -0.5 });
  }

  // Wind
  if (weather.windSpeed > 8) {
    adjustments.push({ reason: `Strong wind (${weather.windSpeed} m/s) dries soil faster`, delta: -0.5 });
  }

  const totalDelta = adjustments.reduce((sum, a) => sum + a.delta, 0);
  const adjustedFreq = Math.max(1, Math.round((baseFreq + totalDelta) * 2) / 2);

  return { adjustedFreq, adjustments };
}

export function WateringSuggestion() {
  const [plantName, setPlantName] = useState("");
  const [lastWatered, setLastWatered] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<WateringResult | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dataset/Indoor_Plant_Health_and_Growth_Factors.csv")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((csvString) => {
        const parsed = Papa.parse<Record<string, string>>(csvString, {
          header: true,
          skipEmptyLines: true,
        });
        setCsvData(parsed.data);
      })
      .catch(() => console.log("CSV not available, using defaults"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName || !lastWatered || !location) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const weather = await fetchWeather(location);

      const daysSince = Math.floor(
        (Date.now() - new Date(lastWatered).getTime()) / (1000 * 60 * 60 * 24)
      );

      const query = plantName.toLowerCase().trim();
      const csvMatch = csvData.find(
        (row) => row.Plant_ID && row.Plant_ID.toLowerCase().includes(query)
      );

      const baseFreq = csvMatch
        ? Math.max(1, parseInt(csvMatch.Watering_Frequency_days) || 3)
        : 3;
      const waterAmountMl = csvMatch
        ? parseFloat(csvMatch.Watering_Amount_ml) || null
        : null;

      const { adjustedFreq, adjustments } = computeWateringAdjustments(baseFreq, weather);

      const daysUntilNext = adjustedFreq - daysSince;
      const shouldWater = daysUntilNext <= 0;
      const urgency: WateringResult["urgency"] =
        daysUntilNext <= 0 ? "now" : daysUntilNext <= 1 ? "soon" : "later";

      let recommendation = "";
      if (urgency === "now") {
        recommendation = `Your ${plantName} is overdue for watering by ${Math.abs(daysUntilNext)} day(s). Given the current weather in ${weather.cityName} (${weather.temperature}°C, ${weather.humidity}% humidity), water it today${waterAmountMl ? ` with about ${waterAmountMl}ml` : ""}.`;
      } else if (urgency === "soon") {
        recommendation = `Your ${plantName} should be watered tomorrow. Current weather (${weather.description}) slightly shortens the usual schedule.`;
      } else {
        recommendation = `Your ${plantName} is fine for now. Next watering is recommended in ${daysUntilNext} day(s), adjusted from the baseline of every ${baseFreq} day(s) based on live weather in ${weather.cityName}.`;
      }

      setResult({
        weather,
        baseFrequencyDays: baseFreq,
        adjustedFrequencyDays: adjustedFreq,
        adjustments,
        daysSinceLastWatered: daysSince,
        shouldWater,
        urgency,
        recommendation,
        waterAmountMl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const urgencyStyles = {
    now: {
      card: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-800",
      body: "text-blue-700",
      label: "Water Now",
    },
    soon: {
      card: "bg-orange-50 border-orange-200",
      icon: "text-orange-500",
      title: "text-orange-800",
      body: "text-orange-700",
      label: "Water Tomorrow",
    },
    later: {
      card: "bg-green-50 border-green-200",
      icon: "text-green-600",
      title: "text-green-800",
      body: "text-green-700",
      label: "No Watering Needed",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Watering Suggestion
          </h1>
          <p className="text-lg text-foreground/70">
            Real-time weather + your plant's data = a personalised watering schedule
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
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground/70">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City / Location
                </span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Delhi, Mumbai, London"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching live weather…
                </>
              ) : (
                "Get Watering Suggestion"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-6">
            {/* Live Weather Card */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Live Weather — {result.weather.cityName}
                </h2>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={result.weather.icon}
                  alt={result.weather.description}
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {result.weather.temperature}°C
                  </p>
                  <p className="text-foreground/60 capitalize">
                    {result.weather.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <ThermometerSun className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-foreground/60">Feels like</p>
                  <p className="font-semibold">{result.weather.feelsLike}°C</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-foreground/60">Humidity</p>
                  <p className="font-semibold">{result.weather.humidity}%</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Wind className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-foreground/60">Wind</p>
                  <p className="font-semibold">{result.weather.windSpeed} m/s</p>
                </div>
              </div>
            </div>

            {/* Frequency Adjustment Breakdown */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Watering Frequency Adjustment
                </h2>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-foreground/60 mb-1">Baseline (CSV)</p>
                  <p className="text-2xl font-bold text-foreground/50">
                    every {result.baseFrequencyDays}d
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-border relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-card px-1 text-foreground/50">
                    adjusted by weather
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-foreground/60 mb-1">Adjusted</p>
                  <p className="text-2xl font-bold text-primary">
                    every {result.adjustedFrequencyDays}d
                  </p>
                </div>
              </div>

              {result.adjustments.length > 0 ? (
                <ul className="space-y-2">
                  {result.adjustments.map((adj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 font-bold w-14 flex-shrink-0 ${
                          adj.delta < 0 ? "text-blue-600" : "text-green-600"
                        }`}
                      >
                        {adj.delta > 0 ? `+${adj.delta}d` : `${adj.delta}d`}
                      </span>
                      <span className="text-foreground/70">{adj.reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-foreground/60">
                  Weather conditions are ideal — no adjustments needed.
                </p>
              )}

              <p className="text-xs text-foreground/50 mt-4">
                Days since last watered: <strong>{result.daysSinceLastWatered}</strong>
              </p>
            </div>

            {/* Final Recommendation */}
            <div
              className={`rounded-2xl border p-6 ${urgencyStyles[result.urgency].card}`}
            >
              <div className="flex items-start gap-3">
                <Droplets
                  className={`w-6 h-6 mt-0.5 flex-shrink-0 ${urgencyStyles[result.urgency].icon}`}
                />
                <div>
                  <p className={`font-bold text-lg mb-1 ${urgencyStyles[result.urgency].title}`}>
                    {urgencyStyles[result.urgency].label}
                  </p>
                  <p className={urgencyStyles[result.urgency].body}>
                    {result.recommendation}
                  </p>
                  {result.waterAmountMl && (
                    <p className={`mt-2 text-sm font-medium ${urgencyStyles[result.urgency].body}`}>
                      Recommended amount: {result.waterAmountMl} ml
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-foreground/60">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Always check soil moisture before watering. Stick your finger 1–2 inches into the soil — if it feels dry, water the plant regardless of the schedule.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
