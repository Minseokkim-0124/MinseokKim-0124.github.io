// All pages are public and exported at build time for GitHub Pages.
// Next.js handles unknown routes with the shared not-found page.
export function RouteGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
