'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

export default function NewConnectionPage() {
  const [form, setForm] = useState({ name: '', kong_admin_url: '', active: true, authType: 'default', apiKeyHeader: 'apikey', apiKeyValue: '', jwtToken: '', basicUser: '', basicPass: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function submit() {
    setSubmitting(true)
    setError('')
    let auth = { type: form.authType }
    if (form.authType === 'key') auth = { type: 'key', header: form.apiKeyHeader, key: form.apiKeyValue }
    if (form.authType === 'jwt') auth = { type: 'jwt', token: form.jwtToken }
    if (form.authType === 'basic') auth = { type: 'basic', username: form.basicUser, password: form.basicPass }
    const payload = { name: form.name, kong_admin_url: form.kong_admin_url, active: !!form.active, auth }
    try {
      const res = await fetch(`${apiBaseUrl()}/api/kongnode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d?.body?.message || `Failed (${res.status})`)
        setSubmitting(false)
        return
      }
      window.location.assign('/connections')
    } catch (e) {
      setError(String(e))
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Add Connection</h1>
      </div>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Production Gateway" />
        </div>
        <div>
          <label>Kong Admin URL</label>
          <input className="form-control" value={form.kong_admin_url} onChange={(e) => update('kong_admin_url', e.target.value)} placeholder="e.g. http://127.0.0.1:8001" />
        </div>
        <div>
          <label>Authentication</label>
          <select className="form-control" value={form.authType} onChange={(e)=>update('authType', e.target.value)}>
            <option value="default">Default</option>
            <option value="key">Key Auth</option>
            <option value="jwt">JWT Auth</option>
            <option value="basic">Basic Auth</option>
          </select>
        </div>
        {form.authType === 'key' && (
          <>
            <div>
              <label>API Key Header</label>
              <input className="form-control" value={form.apiKeyHeader} onChange={(e)=>update('apiKeyHeader', e.target.value)} placeholder="apikey" />
            </div>
            <div>
              <label>API Key Value</label>
              <input className="form-control" value={form.apiKeyValue} onChange={(e)=>update('apiKeyValue', e.target.value)} placeholder="your-key" />
            </div>
          </>
        )}
        {form.authType === 'jwt' && (
          <div style={{ gridColumn: '1 / -1' }}>
            <label>JWT Token</label>
            <input className="form-control" value={form.jwtToken} onChange={(e)=>update('jwtToken', e.target.value)} placeholder="eyJhbGciOi..." />
          </div>
        )}
        {form.authType === 'basic' && (
          <>
            <div>
              <label>Username</label>
              <input className="form-control" value={form.basicUser} onChange={(e)=>update('basicUser', e.target.value)} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" className="form-control" value={form.basicPass} onChange={(e)=>update('basicPass', e.target.value)} />
            </div>
          </>
        )}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={!!form.active} onChange={(e) => update('active', e.target.checked)} /> Active
          </label>
          <p className="muted">Active connection appears in footer as the current gateway.</p>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>{submitting ? 'Saving…' : 'Save Connection'}</button>
        <a href="/connections" className="dropdown-item" style={{ display: 'inline-block', marginLeft: 8 }}>Cancel</a>
      </div>
    </div>
  )
}
