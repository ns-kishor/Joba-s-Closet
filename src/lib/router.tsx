"use client";

/**
 * Lightweight hash router — the whole boutique lives on the `/` route
 * while URLs stay deep-linkable:  #/shop?category=jewelry  ·  #/product/slug
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";

export type Route = {
  path: string; // e.g. "/product/pearl-bangle"
  query: Record<string, string>; // parsed query params
  hash: string; // raw hash without "#"
};

type RouterCtx = Route & {
  navigate: (to: string, opts?: { replace?: boolean; keepScroll?: boolean }) => void;
};

const Ctx = createContext<RouterCtx | null>(null);

function parseHash(raw: string): Route {
  let h = raw.replace(/^#/, "");
  if (!h.startsWith("/")) h = "/" + h;
  const [pathAndQuery] = h.split("#");
  const [path, queryString = ""] = pathAndQuery.split("?");
  const query: Record<string, string> = {};
  if (queryString) {
    for (const [k, v] of new URLSearchParams(queryString).entries()) query[k] = v;
  }
  return { path: path.replace(/\/+$/, "") || "/", query, hash: h };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? { path: "/", query: {}, hash: "/" } : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean; keepScroll?: boolean }) => {
    const target = `#${to.startsWith("/") ? to : "/" + to}`;
    if (opts?.replace) {
      window.history.replaceState(null, "", target);
      setRoute(parseHash(target));
    } else if (window.location.hash === target) {
      setRoute(parseHash(target));
    } else {
      window.location.hash = target; // triggers hashchange
    }
    if (!opts?.keepScroll) {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
    }
  }, []);

  const value = useMemo(() => ({ ...route, navigate }), [route, navigate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRouter(): RouterCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRouter must be used inside <RouterProvider>");
  return ctx;
}

/** Boutique-styled anchor with client-side navigation. */
export function Link({
  to,
  children,
  className,
  onClick,
  ariaLabel,
  keepScroll,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  keepScroll?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let browser handle
    e.preventDefault();
    onClick?.();
    navigate(to, { keepScroll });
  };
  return (
    <a href={`#${to}`} className={className} onClick={handle} aria-label={ariaLabel} {...rest}>
      {children}
    </a>
  );
}
