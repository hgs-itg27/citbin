// app/admin/layout.tsx
import RequireAdminAuth from "@/components/RequireAdminAuth";

/**
 * AdminLayout wraps all admin subpages with an authentication guard.
 *
 * Unauthenticated users are redirected to the home page.
 * This prevents the Verwaltung / admin pages from being visible
 * without a valid login.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAdminAuth>{children}</RequireAdminAuth>;
}
