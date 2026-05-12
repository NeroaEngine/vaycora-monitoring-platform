import Link from "next/link";

const navItems = [
  ["Workboard", "/vaycora"],
  ["Rentals", "/vaycora/rentals"],
  ["Fleet", "/vaycora/fleet"],
  ["Assets", "/vaycora/assets"],
  ["Sanitation", "/vaycora/sanitation"],
  ["Manufacturing", "/vaycora/manufacturing"],
  ["Video", "/vaycora/video"],
  ["SunTech Parser", "/vaycora/integrations/suntech"],
  ["Brand", "/vaycora/settings/brand"],
  ["Admin", "/vaycora/admin/payloads"],
];

export default function VaycoraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="shellHeader" style={{ margin: "18px auto", width: "min(1480px, calc(100% - 36px))" }}>
        <Link href="/vaycora" className="brandMark">
          <span className="brandIcon">V</span>
          <span className="brandText">
            <small>Vaycora</small>
            <strong>Command Center</strong>
          </span>
        </Link>

        <nav className="nav" aria-label="Vaycora navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="navItem">
              {label}
            </Link>
          ))}
        </nav>

        <div className="shellActions">
          <Link href="/api/vaycora/db-check" className="pill good">Live</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
