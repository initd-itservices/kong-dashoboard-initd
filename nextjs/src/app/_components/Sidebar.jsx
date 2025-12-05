'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const sailsBase = process.env.NEXT_PUBLIC_SAILS_URL || ""

  // Local fallback stored in public/assets/images/logo.png
  const localLogo = "/assets/images/logo.png"

  // Remote fallback (if Sails URL is present)
  const sailsLogo = sailsBase ? `${sailsBase}/images/konga-logo.png` : null

  const brandIcon =
    process.env.NEXT_PUBLIC_BRAND_ICON_URL ||
    sailsLogo ||
    localLogo

  useEffect(() => {
    const width = collapsed ? '64px' : '240px'
    document.documentElement.style.setProperty('--sidebar-width', width)
  }, [collapsed])

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <Image
          src={brandIcon}
          alt="Brand"
          width={36}
          height={36}
          className="brand-icon"
        />
        {!collapsed && <span>Kong Dashboard</span>}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(v => !v)}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">API Gateway</div>
          <a href="/consumers" title="Consumers"><span className="nav-icon" aria-hidden>👤</span><span className="nav-label">Consumers</span></a>
          <a href="/services" title="Services"><span className="nav-icon" aria-hidden>☁️</span><span className="nav-label">Services</span></a>
          <a href="/routes" title="Routes"><span className="nav-icon" aria-hidden>🔀</span><span className="nav-label">Routes</span></a>
          <a href="/plugins" title="Plugins"><span className="nav-icon" aria-hidden>🧩</span><span className="nav-label">Plugins</span></a>
          <a href="/upstreams" title="Upstreams"><span className="nav-icon" aria-hidden>⬆️</span><span className="nav-label">Upstreams</span></a>
          <a href="/certificates" title="Certificates"><span className="nav-icon" aria-hidden>🪪</span><span className="nav-label">Certificates</span></a>
        </div>
        <div className="nav-section">
          <div className="nav-section-title">Admin</div>
          <a href="/admin/users" title="Users"><span className="nav-icon" aria-hidden>👥</span><span className="nav-label">Users</span></a>
          <a href="/admin/snapshots" title="Snapshots"><span className="nav-icon" aria-hidden>📸</span><span className="nav-label">Snapshots</span></a>
          <a href="/admin/settings" title="Settings"><span className="nav-icon" aria-hidden>⚙️</span><span className="nav-label">Settings</span></a>
          <a href="/connections" title="Connections"><span className="nav-icon" aria-hidden>🔗</span><span className="nav-label">Connections</span></a>
        </div>
      </nav>
    </aside>
  )
}
