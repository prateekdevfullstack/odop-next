export type Language = "en" | "hi";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** True only for `/hi` and `/hi/...`, not paths like `/history`. */
export function isHindiPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    return pathname === "/hi" || pathname.startsWith("/hi/");
}

export function getLocaleFromPathname(pathname: string | null | undefined): Language {
    return isHindiPath(pathname) ? "hi" : "en";
}

/**
 * Browser URL path (includes `/hi` prefix). usePathname() returns the rewritten
 * internal path when proxy rewrites `/hi/...` → `/...`, so prefer this on the client.
 */
export function getVisiblePathname(fallback?: string | null): string {
    if (typeof window !== "undefined") {
        return window.location.pathname;
    }
    return fallback ?? "/";
}

export function localizePathname(pathname: string, lang: Language): string {
    const base =
        pathname === "/hi"
            ? "/"
            : pathname.startsWith("/hi/")
              ? pathname.slice(3) || "/"
              : pathname;

    if (lang === "hi") {
        return base === "/" ? "/hi" : `/hi${base}`;
    }
    return base;
}

export function setLocaleCookie(lang: Language): void {
    if (typeof document === "undefined") return;
    document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function pickLocalized(
    isHi: boolean,
    hindi: string | null | undefined,
    english: string | null | undefined,
): string {
    const value = isHi ? hindi || english : english;
    return value?.trim() || "";
}

export function resolveProductCategoryLabel(
    category: {
        name: string;
        name_hindi?: string | null;
        nameHindi?: string | null;
    },
    isHi: boolean,
): string {
    const hindi = category.name_hindi ?? category.nameHindi;
    return pickLocalized(isHi, hindi, category.name);
}
