'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

function toArray(input) {
  if (!input) return undefined
  return input.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function NewServicePage() {
  const [form, setForm] = useState({
    name: '',
    url: '',
    protocol: 'http',
    host: '',
    port: 80,
    path: '',
    retries: 5,
    connect_timeout: 60000,
    write_timeout: 60000,
    read_timeout: 60000,
    client_certificate_id: '',
    description: '',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function clearEmpty(obj) {
    const out = {}
    Object.keys(obj).forEach((k) => {
      const v = obj[k]
      if (v !== '' && v !== undefined && v !== null) out[k] = v
    })
    return out
  }

  async function submit() {
    setSubmitting(true)
    setError('')
    setFieldErrors({})
    const payload = clearEmpty({
      name: form.name,
      url: form.url,
      protocol: form.protocol,
      host: form.host,
      port: form.port,
      path: form.path,
      retries: form.retries,
      connect_timeout: form.connect_timeout,
      write_timeout: form.write_timeout,
      read_timeout: form.read_timeout,
      client_certificate: form.client_certificate_id ? { id: form.client_certificate_id } : undefined,
      tags: toArray(form.tags),
      extras: {
        description: form.description || undefined,
        tags: toArray(form.tags)
      }
    })

    try {
      const res = await fetch(`${apiBaseUrl()}/kong/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const body = data?.body
        if (body?.fields) setFieldErrors(body.fields)
        setError(body?.message || `Failed (${res.status})`)
        setSubmitting(false)
        return
      }
      window.location.assign('/services')
    } catch (e) {
      setError(String(e))
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1 className="title">Create Service</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => update('name', e.target.value)} />
          {fieldErrors.name && <div className="muted">{fieldErrors.name}</div>}
        </div>
        <div>
          <label>Url</label>
          <input className="form-control" value={form.url} onChange={(e) => update('url', e.target.value)} />
          {fieldErrors.url && <div className="muted">{fieldErrors.url}</div>}
        </div>
        <div>
          <label>Protocol</label>
          <input className="form-control" value={form.protocol} onChange={(e) => update('protocol', e.target.value)} />
          {fieldErrors.protocol && <div className="muted">{fieldErrors.protocol}</div>}
        </div>
        <div>
          <label>Host</label>
          <input className="form-control" value={form.host} onChange={(e) => update('host', e.target.value)} />
          {fieldErrors.host && <div className="muted">{fieldErrors.host}</div>}
        </div>
        <div>
          <label>Port</label>
          <input type="number" className="form-control" value={form.port} onChange={(e) => update('port', Number(e.target.value))} />
          {fieldErrors.port && <div className="muted">{fieldErrors.port}</div>}
        </div>
        <div>
          <label>Path</label>
          <input className="form-control" value={form.path} onChange={(e) => update('path', e.target.value)} />
          {fieldErrors.path && <div className="muted">{fieldErrors.path}</div>}
        </div>
        <div>
          <label>Retries</label>
          <input type="number" className="form-control" value={form.retries} onChange={(e) => update('retries', Number(e.target.value))} />
          {fieldErrors.retries && <div className="muted">{fieldErrors.retries}</div>}
        </div>
        <div>
          <label>Connect timeout</label>
          <input type="number" className="form-control" value={form.connect_timeout} onChange={(e) => update('connect_timeout', Number(e.target.value))} />
          {fieldErrors.connect_timeout && <div className="muted">{fieldErrors.connect_timeout}</div>}
        </div>
        <div>
          <label>Write timeout</label>
          <input type="number" className="form-control" value={form.write_timeout} onChange={(e) => update('write_timeout', Number(e.target.value))} />
          {fieldErrors.write_timeout && <div className="muted">{fieldErrors.write_timeout}</div>}
        </div>
        <div>
          <label>Read timeout</label>
          <input type="number" className="form-control" value={form.read_timeout} onChange={(e) => update('read_timeout', Number(e.target.value))} />
          {fieldErrors.read_timeout && <div className="muted">{fieldErrors.read_timeout}</div>}
        </div>
        <div>
          <label>Client certificate id</label>
          <input className="form-control" value={form.client_certificate_id} onChange={(e) => update('client_certificate_id', e.target.value)} />
          {fieldErrors.client_certificate && <div className="muted">{fieldErrors.client_certificate}</div>}
        </div>
        <div>
          <label>Description</label>
          <input className="form-control" value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input className="form-control" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>
          {submitting ? 'Submitting...' : 'Submit Service'}
        </button>
      </div>
    </div>
  )
}
