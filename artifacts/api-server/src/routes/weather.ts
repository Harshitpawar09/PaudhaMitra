import { Router } from "express";

const router = Router();

router.get("/weather", async (req, res) => {
  const city = req.query.q as string;
  if (!city) {
    res.status(400).json({ error: "Missing query parameter: q" });
    return;
  }

  const apiKey = process.env.PaudhaMitra;
  if (!apiKey) {
    res.status(500).json({ error: "Weather API key not configured on server." });
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.message || "Weather API error" });
      return;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to reach weather service." });
  }
});

export default router;
