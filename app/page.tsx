/**
 * Root page.tsx — Redirects to the marketing landing page.
 *
 * With the route group restructuring, the actual landing page
 * is now at app/(marketing)/page.tsx. This root page.tsx is
 * replaced by the (marketing) route group which handles "/".
 *
 * This file can be safely deleted once the (marketing) route
 * group is confirmed working, as Next.js will automatically
 * serve (marketing)/page.tsx for the "/" route.
 */

export { default } from "./(marketing)/page";
