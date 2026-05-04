"use client";

import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, MouseEvent } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import { usePathname, useSearchParams } from "next/navigation";

type AppLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AppLink({
  href,
  onClick,
  target,
  children,
  ...props
}: AppLinkProps) {
  const { startLoading } = useLoadingStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    if (e.defaultPrevented) return;

    if (
      target === "_blank" ||
      typeof href !== "string" ||
      href.startsWith("http") ||
      href.startsWith("#")
    ) {
      return;
    }

    // Prevent infinite loading when clicking a link to the current page
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (href === currentPath || href === pathname) {
      return;
    }

    startLoading();
  };

  return (
    <Link href={href} onClick={handleClick} target={target} {...props}>
      {children}
    </Link>
  );
}
