import "@fontsource-variable/figtree";
import "@fontsource-variable/jetbrains-mono";
import "katex/dist/katex.min.css";
import "./globals.css";
import "./site.css";
import "./med/med.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { HOME_HASH } from "./router";

// The bare site link (no #/ page in the address) starts on the Guide; #/ is still the course list.
if (window.location.hash === "" || window.location.hash === "#") history.replaceState(null, "", HOME_HASH);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
