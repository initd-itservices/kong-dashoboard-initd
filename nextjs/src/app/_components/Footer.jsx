'use client'
import { useEffect, useState } from 'react'

function GitLinks() {
  const issuesUrl = process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL || '#'
  const supportUrl = process.env.NEXT_PUBLIC_GITHUB_SUPPORT_URL || '#'
  return (
    <div className="footer-links">
      <a href={issuesUrl} target="_blank" rel="noreferrer">GitHub Issues</a>
      <span className="spacer">•</span>
      <a href={supportUrl} target="_blank" rel="noreferrer">Project Support</a>
    </div>
  )
}

export default function Footer() {
  const [gateway, setGateway] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_SAILS_URL || ''
        const res = await fetch(`${base}/api/kongnode`)
        const data = await res.json().catch(() => [])
        const list = Array.isArray(data) ? data : data.data || []
        const active = list.find((n) => n.active) || null
        setGateway(active)
      } catch {}
    }
    load()
  }, [])

  return (
    <footer className="footer">
      <div className="footer-inner">
        <GitLinks />
        <div className="footer-right">
          <span className="footer-icon">🛰️</span>
          <span className="footer-gateway">{gateway ? (gateway.name || gateway.kong_admin_url) : 'No gateway connected'}</span>
        </div>
      </div>
    </footer>
  )
}
