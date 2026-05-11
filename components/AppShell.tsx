import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'OBS Reviews', href: '/obs-reviews' },
  { label: 'Assets', href: '/assets' },
  { label: 'Admin', href: '/admin' },
  { label: 'Branding', href: '/admin/branding' }
];

export function AppShell({ children, active = 'Dashboard' }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="appShell">
      <header className="shellHeader">
        <Link href="/dashboard" className="brandMark">
          <span className="brandIcon">VM</span>
          <span className="brandText">
            <small>Vaycora</small>
            <strong>Asset Operations</strong>
          </span>
        </Link>

        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`navItem ${active === item.label ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="shellActions">
          <span className="pill">Architecture Mode</span>
          <Link href="/admin/branding" className="btn secondary">Themes</Link>
        </div>
      </header>

      <main className="main">
        <div className="pageFrame">{children}</div>
      </main>
    </div>
  );
}
