'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiBaseUrl } from '../../../lib/api'

export default function NewPluginPage() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ name: '', scope: 'global', targetId: '', config: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  useEffect(() => {
    const name = searchParams.get('name') || ''
    const scope = searchParams.get('scope') || ''
    setForm(f => ({ ...f, name: name || f.name, scope: scope || f.scope }))
  }, [searchParams])

  async function submit() {
    setSubmitting(true)
    setError('')
    let payload = { name: form.name }
    if (form.scope === 'service') payload.service = { id: form.targetId }
    if (form.scope === 'route') payload.route = { id: form.targetId }
    if (form.scope === 'consumer') payload.consumer = { id: form.targetId }
    if (form.config) {
      try { payload.config = JSON.parse(form.config) } catch { setError('Invalid config JSON'); setSubmitting(false); return }
    }
    try {
      const res = await fetch(`${apiBaseUrl()}/kong/plugins`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d?.body?.message || `Failed (${res.status})`); setSubmitting(false); return }
      window.location.assign('/plugins')
    } catch (e) { setError(String(e)); setSubmitting(false) }
  }

  return (
    <div className="card">
      <h1 className="title">Add Plugin</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label>Scope</label>
          <select className="form-control" value={form.scope} onChange={(e) => update('scope', e.target.value)}>
            <option value="global">Global</option>
            <option value="service">Service</option>
            <option value="route">Route</option>
            <option value="consumer">Consumer</option>
          </select>
        </div>
        {form.scope !== 'global' && (
          <div>
            <label>Target ID</label>
            <input className="form-control" value={form.targetId} onChange={(e) => update('targetId', e.target.value)} />
          </div>
        )}
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Config (JSON)</label>
          <textarea className="form-control" rows={6} value={form.config} onChange={(e) => update('config', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </div>
    </div>
  )
}
