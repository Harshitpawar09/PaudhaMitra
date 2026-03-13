import { useState } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface PredictionResult {
  disease: string;
  confidence: number;
  treatment: string;
  symptoms: string;
  topPredictions?: { name: string; confidence: number }[];
}

export function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlant = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const isHealthy = result?.disease?.toLowerCase().includes("healthy");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plant Disease Detection
          </h1>
          <p className="text-lg text-foreground/70">
            Upload a photo of your plant leaf to detect diseases using AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/60 transition-colors bg-card"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Plant to analyze"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                  <p className="mt-3 text-sm text-foreground/60">
                    Click or drag to replace
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Upload Plant Image
                  </p>
                  <p className="text-sm text-foreground/60">
                    Drag & drop or click to select
                  </p>
                  <p className="text-xs text-foreground/40 mt-2">
                    Supports JPG, PNG, WebP
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <button
              onClick={analyzePlant}
              disabled={!selectedImage || analyzing}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Analyze Plant
                </>
              )}
            </button>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div>
            {!result && !analyzing && (
              <div className="h-full flex items-center justify-center text-center p-8 bg-card rounded-2xl border border-border">
                <div>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ready to Analyze</h3>
                  <p className="text-foreground/60 text-sm">
                    Upload an image of your plant leaf and click Analyze to detect diseases using our AI model.
                  </p>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="h-full flex items-center justify-center text-center p-8 bg-card rounded-2xl border border-border">
                <div>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="font-medium">Analyzing your plant...</p>
                  <p className="text-sm text-foreground/60 mt-2">
                    Our AI model is processing the image
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  {isHealthy ? (
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-foreground/60">Diagnosis Result</p>
                    <p className="text-xl font-bold text-primary">{result.disease}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-foreground/60 mb-1">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {result.confidence.toFixed(1)}%
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {result.topPredictions && result.topPredictions.length > 1 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 text-foreground/70">
                      Top Predictions
                    </p>
                    <div className="space-y-1.5">
                      {result.topPredictions.map((pred, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className={i === 0 ? "font-medium text-primary" : "text-foreground/70"}>
                            {pred.name}
                          </span>
                          <span className="text-foreground/50">{pred.confidence.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Symptoms</h3>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {result.symptoms}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Treatment Recommendations
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {result.treatment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
