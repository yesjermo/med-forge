import { useEffect, useState } from "react";

/** Hash routes, because GitHub Pages has no server-side rewrites: #/, #/check, #/hub, #/hub/new, #/hub/<id>, #/settings. */
export interface Route {
  path: string;
  segments: string[];
  query: URLSearchParams;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    // A hand-edited hash can contain an incomplete escape sequence.
    return segment;
  }
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart = ""] = raw.split("?");
  const path = pathPart!.startsWith("/") ? pathPart! : `/${pathPart}`;
  return {
    path,
    segments: path.split("/").filter(Boolean).map(decodeSegment),
    query: new URLSearchParams(queryPart),
  };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function go(path: string): void {
  window.location.hash = path;
}
