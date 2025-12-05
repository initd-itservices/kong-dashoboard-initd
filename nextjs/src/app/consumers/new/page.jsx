'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

function toArray(v) { if (!v) return undefined; return v.split(',').map(s=>s.trim()).filter(Boolean) }

export default function NewConsumerPage() {
  const [form, setForm] = useState({ username: '', custom_id: '', tags: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function update(k, v) { setForm(f=>({ ...f, [k]: v })) }

  function clearEmpty(obj) {
    const out = {}
    Object.keys(obj).forEach((k) => {
      const v = obj[k]
      if (v !== '' && v !== undefined && v !== null) out[k] = v
    })
    return out
  }

  async function submit() {
    setSubmitting(true); setError(''); setFieldErrors({})
    const payload = clearEmpty({ username: form.username, custom_id: form.custom_id, tags: toArray(form.tags) })
    try {
      const res = await fetch(`${apiBaseUrl()}/kong/consumers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(()=>({})); const body = d?.body; if (body?.fields) setFieldErrors(body.fields); setError(body?.message || `Failed (${res.status})`); setSubmitting(false); return }
      window.location.assign('/consumers')
    } catch(e) { setError(String(e)); setSubmitting(false) }
  }

  return (
    <div className="card">
      <h1 className="title">Create Consumer</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Username</label>
          <input className="form-control" value={form.username} onChange={(e)=>update('username', e.target.value)} />
          {fieldErrors.username && <div className="muted">{fieldErrors.username}</div>}
          <p className="muted">Send either username or custom_id.</p>
        </div>
        <div>
          <label>Custom ID</label>
          <input className="form-control" value={form.custom_id} onChange={(e)=>update('custom_id', e.target.value)} />
          {fieldErrors.custom_id && <div className="muted">{fieldErrors.custom_id}</div>}
          <p className="muted">External ID mapping for consumer.</p>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Tags (comma separated)</label>
          <input className="form-control" value={form.tags} onChange={(e)=>update('tags', e.target.value)} />
          {fieldErrors.tags && <div className="muted">{String(fieldErrors.tags)}</div>}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>{submitting ? 'Submitting...' : 'Submit Consumer'}</button>
      </div>
    </div>
  )
}
