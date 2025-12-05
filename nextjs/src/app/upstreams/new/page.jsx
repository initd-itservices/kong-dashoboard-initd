'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

function toArray(v) { if (!v) return undefined; return v.split(',').map(s=>s.trim()).filter(Boolean) }

export default function NewUpstreamPage() {
  const [form, setForm] = useState({ name: '', slots: 10000, tags: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(k, v) { setForm(f=>({ ...f, [k]: v })) }

  async function submit() {
    setSubmitting(true); setError('')
    const payload = { name: form.name, slots: Number(form.slots), tags: toArray(form.tags) }
    try {
      const res = await fetch(`${apiBaseUrl()}/kong/upstreams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d?.body?.message || `Failed (${res.status})`); setSubmitting(false); return }
      window.location.assign('/upstreams')
    } catch(e) { setError(String(e)); setSubmitting(false) }
  }

  return (
    <div className="card">
      <h1 className="title">Create Upstream</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e)=>update('name', e.target.value)} />
        </div>
        <div>
          <label>Slots</label>
          <input type="number" className="form-control" value={form.slots} onChange={(e)=>update('slots', Number(e.target.value))} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Tags (comma separated)</label>
          <input className="form-control" value={form.tags} onChange={(e)=>update('tags', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>{submitting ? 'Submitting...' : 'Submit Upstream'}</button>
      </div>
    </div>
  )
}
