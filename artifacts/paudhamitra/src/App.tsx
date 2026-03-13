import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { PlantGuide } from "./pages/PlantGuide";
import { WateringSuggestion } from "./pages/WateringSuggestion";
import { About } from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "disease-detection", Component: DiseaseDetection },
      { path: "plant-guide", Component: PlantGuide },
      { path: "watering-suggestion", Component: WateringSuggestion },
      { path: "about", Component: About },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
