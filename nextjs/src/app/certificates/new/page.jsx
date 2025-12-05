'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

function toArray(v) { if (!v) return undefined; return v.split(',').map(s=>s.trim()).filter(Boolean) }

export default function NewCertificatePage() {
  const [form, setForm] = useState({ cert: '', key: '', snis: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(k, v) { setForm(f=>({ ...f, [k]: v })) }

  async function submit() {
    setSubmitting(true); setError('')
    const payload = { cert: form.cert, key: form.key, snis: toArray(form.snis) }
    try {
      const res = await fetch(`${apiBaseUrl()}/kong/certificates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d?.body?.message || `Failed (${res.status})`); setSubmitting(false); return }
      window.location.assign('/certificates')
    } catch(e) { setError(String(e)); setSubmitting(false) }
  }

  return (
    <div className="card">
      <h1 className="title">Add Certificate</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Certificate (PEM)</label>
          <textarea className="form-control" rows={6} value={form.cert} onChange={(e)=>update('cert', e.target.value)} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Key (PEM)</label>
          <textarea className="form-control" rows={6} value={form.key} onChange={(e)=>update('key', e.target.value)} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>SNIs (comma separated)</label>
          <input className="form-control" value={form.snis} onChange={(e)=>update('snis', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>{submitting ? 'Submitting...' : 'Submit Certificate'}</button>
      </div>
    </div>
  )
}
