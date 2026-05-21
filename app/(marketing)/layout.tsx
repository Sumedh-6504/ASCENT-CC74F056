/**
 * Marketing Layout — Public pages (no authentication required).
 *
 * Used for the landing page and any future public marketing pages.
 * Does NOT include the Navbar or any auth-related UI.
 */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
