"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, getVisiblePathname, type Language } from "@/lib/locale";

const LanguageContext = createContext<Language>("en");

export function LanguageProvider({
    initialLang,
    children,
}: {
    initialLang: Language;
    children: ReactNode;
}) {
    const pathname = usePathname();
    const [lang, setLang] = useState(initialLang);

    useEffect(() => {
        setLang(getLocaleFromPathname(getVisiblePathname(pathname)));
    }, [pathname]);

    return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): Language {
    return useContext(LanguageContext);
}
