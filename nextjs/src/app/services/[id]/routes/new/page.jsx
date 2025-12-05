'use client'
import { useState } from 'react'
import { apiBaseUrl } from '../../../../../lib/api'

function toArray(input) {
  if (!input) return undefined
  return input.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function NewRouteForService({ params }) {
  const { id } = params
  const [form, setForm] = useState({
    name: '',
    hosts: '',
    paths: '',
    methods: '',
    protocols: 'http,https',
    strip_path: true,
    preserve_host: false,
    https_redirect_status_code: 426,
    regex_priority: 0,
    path_handling: 'v1'
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
      hosts: toArray(form.hosts),
      paths: toArray(form.paths),
      methods: toArray(form.methods),
      protocols: toArray(form.protocols),
      strip_path: !!form.strip_path,
      preserve_host: !!form.preserve_host,
      https_redirect_status_code: Number(form.https_redirect_status_code),
      regex_priority: Number(form.regex_priority),
      path_handling: form.path_handling
    })

    try {
      const res = await fetch(`${apiBaseUrl()}/kong/services/${id}/routes`, {
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
      window.location.assign(`/services/${id}`)
    } catch (e) {
      setError(String(e))
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h1 className="title">Create Route</h1>
      {error && <p className="muted">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => update('name', e.target.value)} />
          {fieldErrors.name && <div className="muted">{fieldErrors.name}</div>}
        </div>
        <div>
          <label>Hosts (comma separated)</label>
          <input className="form-control" value={form.hosts} onChange={(e) => update('hosts', e.target.value)} />
          {fieldErrors.hosts && <div className="muted">{String(fieldErrors.hosts)}</div>}
        </div>
        <div>
          <label>Paths (comma separated)</label>
          <input className="form-control" value={form.paths} onChange={(e) => update('paths', e.target.value)} />
          {fieldErrors.paths && <div className="muted">{String(fieldErrors.paths)}</div>}
        </div>
        <div>
          <label>Methods (comma separated)</label>
          <input className="form-control" value={form.methods} onChange={(e) => update('methods', e.target.value)} />
          {fieldErrors.methods && <div className="muted">{String(fieldErrors.methods)}</div>}
        </div>
        <div>
          <label>Protocols (comma separated)</label>
          <input className="form-control" value={form.protocols} onChange={(e) => update('protocols', e.target.value)} />
          {fieldErrors.protocols && <div className="muted">{String(fieldErrors.protocols)}</div>}
        </div>
        <div>
          <label>Strip Path</label>
          <input type="checkbox" checked={form.strip_path} onChange={(e) => update('strip_path', e.target.checked)} />
        </div>
        <div>
          <label>Preserve Host</label>
          <input type="checkbox" checked={form.preserve_host} onChange={(e) => update('preserve_host', e.target.checked)} />
        </div>
        <div>
          <label>HTTPS Redirect Status Code</label>
          <input type="number" className="form-control" value={form.https_redirect_status_code} onChange={(e) => update('https_redirect_status_code', e.target.value)} />
        </div>
        <div>
          <label>Regex Priority</label>
          <input type="number" className="form-control" value={form.regex_priority} onChange={(e) => update('regex_priority', e.target.value)} />
        </div>
        <div>
          <label>Path Handling</label>
          <input className="form-control" value={form.path_handling} onChange={(e) => update('path_handling', e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={submitting} onClick={submit}>
          {submitting ? 'Submitting...' : 'Submit Route'}
        </button>
      </div>
    </div>
  )
}
