"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href }: BackButtonProps) {
  const pathname = usePathname();
  const backHref = href || pathname.split("/").slice(0, -1).join("/") || "/";

  return (
    <Link href={backHref} className="back-button" aria-label="Go back">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}
