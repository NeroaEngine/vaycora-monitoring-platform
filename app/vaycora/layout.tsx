import Link from "next/link";

const navItems = [
  ["Workboard", "/vaycora"],
  ["Rental Alerts", "/vaycora/rentals/alerts"],
  ["Payload Admin", "/vaycora/admin/payloads"],
  ["Brand Settings", "/vaycora/settings/brand"],
  ["DB Check", "/api/vaycora/db-check"],
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
          <span className="pill good">Live</span>
        </div>
      </header>
      {children}
    </div>
  );
}
