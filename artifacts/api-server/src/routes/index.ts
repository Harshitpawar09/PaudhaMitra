import app from "./app";

// 1. Only start the server listening if we are NOT in production (Vercel)
if (process.env.NODE_ENV !== "production") {
  // Added a fallback to 3000 so your local dev experience is smoother
  const rawPort = process.env["PORT"] || "3000"; 
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// 2. CRUCIAL FOR VERCEL: Export the Express app so Vercel can route traffic to it
export default app;
