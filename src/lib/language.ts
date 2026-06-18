import { headers } from "next/headers";
import type { Language } from "@/lib/locale";

export type { Language } from "@/lib/locale";

export async function getLanguageServer(): Promise<Language> {
    try {
        const headersList = await headers();
        const lang = headersList.get("x-lang") as Language;
        return lang === "hi" ? "hi" : "en";
    } catch {
        return "en";
    }
}
