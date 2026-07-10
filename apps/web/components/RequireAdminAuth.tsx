// components/RequireAdminAuth.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * RequireAdminAuth is a client-side authentication guard for admin pages.
 *
 * It checks `sessionStorage` for stored credentials on mount.
 * If no credentials are found, the user is redirected to the login page
 * (`/login?redirect=<original_path>`). After successful login the user
 * is sent back to the originally requested page.
 * While the check is in progress, nothing is rendered (avoids flash of content).
 *
 * @param children - The protected content to render when authenticated.
 */
export default function RequireAdminAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const credentials = sessionStorage.getItem("credentials");
    if (!credentials) {
      const encodedRedirect = encodeURIComponent(pathname);
      router.push(`/login?redirect=${encodedRedirect}`);
    } else {
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  // Show nothing until we know the auth state (avoids flash of protected content)
  if (isAuthorized !== true) {
    return null;
  }

  return <>{children}</>;
}
