"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type FeatureGridLinkProps = {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function FeatureGridLink({
  href,
  className,
  "aria-label": ariaLabel,
  children,
}: FeatureGridLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (href.startsWith("#")) {
    const hash = href;
    const targetId = hash.slice(1);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      if (isHome) {
        scrollToSection(targetId);
        window.history.replaceState(null, "", hash);
        return;
      }

      window.location.href = `/${hash}`;
    };

    return (
      <a href={`/${hash}`} onClick={handleClick} aria-label={ariaLabel} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
}
