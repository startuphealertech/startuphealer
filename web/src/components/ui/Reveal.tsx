// Scroll-reveal using CSS scroll-driven animations (see .reveal in globals.css).
// Content is never hidden: browsers without `animation-timeline` simply show it — safe for SEO and no-JS.
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
