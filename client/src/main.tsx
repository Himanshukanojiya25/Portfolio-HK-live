import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element #root not found! Check index.html");
} else {
  createRoot(rootElement).render(<App />);
}