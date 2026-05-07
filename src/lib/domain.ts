const hostname = window.location.hostname;

// Per testare l'area app in locale: VITE_IS_APP=true bun run dev
export const isAppDomain =
  hostname.startsWith("app.") ||
  import.meta.env.VITE_IS_APP === "true";

// URL dell'area riservata
export const APP_URL =
  isAppDomain && (hostname === "localhost" || hostname === "127.0.0.1")
    ? ""
    : "https://app.studentatonapoleone.com";
