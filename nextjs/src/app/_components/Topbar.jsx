'use client'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('John')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const onDocClick = () => setOpen(false)
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
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

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <span className="topbar-title">API Gateway</span>
        </div>
        <div className="topbar-right">
          <a href="#" className="topbar-icon" title="Notifications">🔔</a>
          <div className="account">
            <span className="avatar">👤</span>
            <button className="account-trigger" onClick={(e)=>{ e.stopPropagation(); toggle(e) }} aria-expanded={open} aria-haspopup="menu">
              <span className="account-label">Hi {userName}</span>
              <span className="caret">▾</span>
            </button>
            <div className={`dropdown${open ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <a href="/admin/users" className="dropdown-item"><span className="dropdown-icon">👤</span><span className="dropdown-label">Profile</span></a>
              {isAdmin && (
                <a href="/admin/users" className="dropdown-item"><span className="dropdown-icon">👥</span><span className="dropdown-label">Users</span></a>
              )}
              <a href="/admin/settings" className="dropdown-item"><span className="dropdown-icon">⚙️</span><span className="dropdown-label">Settings</span></a>
              <a href="/logout" className="dropdown-item"><span className="dropdown-icon">🚪</span><span className="dropdown-label">Logout</span></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
