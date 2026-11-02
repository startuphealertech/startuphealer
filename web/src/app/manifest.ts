import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StartupHealer",
    short_name: "StartupHealer",
    description: "Your Growth Partner for Compliance, Funding, and Scale",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#06b6d4",
    icons: [{ src: "/icon.png", sizes: "1024x768", type: "image/png" }],
  };
}
