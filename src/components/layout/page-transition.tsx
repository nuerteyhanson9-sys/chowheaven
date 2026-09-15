"use client";

import { usePathname } from "next/navigation";

/**
 * Subtle, fast page-transition wrapper. On every route change the subtree is
 * remounted under a new key so a gentle fade + upward drift is played once.
 * Staggered sections inside each page (Reveal) then animate in as usual.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}