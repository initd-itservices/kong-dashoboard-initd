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
          width={40}
          height={40}
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
          <a href="/dashboard" title="Dashboard"><Image src="/assets/images/icons/dashboard-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Dashboard</span></a>
          <a href="/info" title="Information"><Image src="/assets/images/icons/info-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Info</span></a>
          <a href="/consumers" title="Consumers"><Image src="/assets/images/icons/user-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Consumers</span></a>
          <a href="/services" title="Services"><Image src="/assets/images/icons/services-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Services</span></a>
          <a href="/routes" title="Routes"><Image src="/assets/images/icons/routes-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Routes</span></a>
          <a href="/plugins" title="Plugins"><Image src="/assets/images/icons/plugins-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Plugins</span></a>
          <a href="/upstreams" title="Upstreams"><Image src="/assets/images/icons/upstream-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Upstreams</span></a>
          <a href="/certificates" title="Certificates"><Image src="/assets/images/icons/certificate-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Certificates</span></a>
        </div>
        <div className="nav-section">
          <div className="nav-section-title">Admin</div>
          <a href="/admin/users" title="Users"><Image src="/assets/images/icons/users-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Users</span></a>
          <a href="/admin/snapshots" title="Snapshots"><Image src="/assets/images/icons/snapshot-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Snapshots</span></a>
          <a href="/admin/settings" title="Settings"><Image src="/assets/images/icons/settings-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Settings</span></a>
          <a href="/connections" title="Connections"><Image src="/assets/images/icons/connection-icons.png" alt="" width={18} height={18} className="nav-icon" /><span className="nav-label">Connections</span></a>
        </div>
      </nav>
    </aside>
  )
}
