'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('John')
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const accountRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (ev) => {
      if (!accountRef.current) return
      if (!accountRef.current.contains(ev.target)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('currentUser')
      if (raw) {
        const obj = JSON.parse(raw)
        const name = obj?.username || obj?.name || (obj?.email ? String(obj.email).split('@')[0] : '')
        setUserName(name || 'John')
        setIsAdmin(!!(obj?.isAdmin || obj?.role === 'admin'))
      }
    } catch {}
  }, [])

  function toggle(e) {
    e.stopPropagation()
    setOpen((v) => !v)
  }

  const segments = (pathname || '/').split('/').filter(Boolean)
  const labels = {
    dashboard: 'Dashboard',
    info: 'Info',
    consumers: 'Consumers',
    services: 'Services',
    routes: 'Routes',
    plugins: 'Plugins',
    upstreams: 'Upstreams',
    certificates: 'Certificates',
    admin: 'Admin',
    users: 'Users',
    snapshots: 'Snapshots',
    settings: 'Settings',
    connections: 'Connections'
  }
  const crumbs = []
  let acc = ''
  segments.forEach((seg) => {
    acc += '/' + seg
    const label = labels[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1))
    crumbs.push({ label, path: acc })
  })

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <span className="topbar-title">API Gateway</span>
          <nav className="breadcrumb">
            {crumbs.map((c, idx) => (
              <span key={idx} className="breadcrumb-item">
                {idx > 0 && <span className="breadcrumb-sep">/</span>}
                {idx < crumbs.length - 1 ? (
                  <a href={c.path} style={{ textDecoration: 'none' }}  title={c.label}>{c.label}</a>
                ) : (
                  <span className="breadcrumb-current">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
        <div className="topbar-right">
          <a href="#" className="topbar-icon" title="Notifications"><Image src="/assets/images/icons/notification-icon.png" alt="" width={18} height={18} className="nav-icon" /></a>
          <div className="account" ref={accountRef}>
            <span className="avatar"><Image src="/assets/images/icons/user-icon.png" alt="" width={18} height={18} className="nav-icon" /></span>
            <button className="account-trigger" onClick={(e)=>{ e.stopPropagation(); toggle(e) }} aria-expanded={open} aria-haspopup="menu">
              <span className="account-label">Hi {userName}</span>
              <span className="caret">▾</span>
            </button>
            <div className={`dropdown${open ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <a href="/admin/users" className="dropdown-item"><Image src="/assets/images/icons/user-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="dropdown-label">Profile</span></a>
              {isAdmin && (
                <a href="/admin/users" className="dropdown-item"><Image src="/assets/images/icons/user-icon.png" alt="" width={18} height={18} className="nav-icon" /><span className="dropdown-label">Users</span></a>
              )}
              <a href="/admin/settings" className="dropdown-item"><span className="dropdown-icon"><Image src="/assets/images/icons/settings-icon.png" alt="" width={18} height={18} className="nav-icon" /></span><span className="dropdown-label">Settings</span></a>
              <a href="/logout" className="dropdown-item"><span className="dropdown-icon"><Image src="/assets/images/icons/logout-icon.png" alt="" width={18} height={18} className="nav-icon" /></span><span className="dropdown-label">Logout</span></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
