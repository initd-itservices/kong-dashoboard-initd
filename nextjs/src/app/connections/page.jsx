"use client"
import { useEffect, useState } from 'react'
import { apiBaseUrl } from '../../lib/api'

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([])
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')

  const [alertForm, setAlertForm] = useState({ connectionId: '', type: 'node_down', enabled: true, latencyMs: 500, errorRatePct: 20, recipients: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadAll() {
      try {
        const base = apiBaseUrl()
        const [connRes, alertsRes] = await Promise.all([
          fetch(`${base}/api/kongnode`).then(r=>r.json()).catch(()=>({ data: [] })),
          fetch(`${base}/api/settings/alerts`).then(r=>r.json()).catch(()=>({ data: [] })),
        ])
        const connList = Array.isArray(connRes) ? connRes : connRes.data || []
        const alertsList = Array.isArray(alertsRes) ? alertsRes : alertsRes.data || []
        setConnections(connList)
        setAlerts(alertsList)
        if (connList.length && !alertForm.connectionId) setAlertForm(f=>({ ...f, connectionId: connList[0].id }))
      } catch(e) {
        setError(String(e))
      }
    }
    loadAll()
  }, [])

  function updateAlert(k, v) { setAlertForm(f=>({ ...f, [k]: v })) }

  async function saveAlert() {
    setSaving(true)
    setError('')
    const payload = {
      connectionId: alertForm.connectionId,
      type: alertForm.type,
      enabled: !!alertForm.enabled,
      config: {
        latencyMs: Number(alertForm.latencyMs) || 0,
        errorRatePct: Number(alertForm.errorRatePct) || 0,
        recipients: String(alertForm.recipients || '')
      }
    }
    try {
      const res = await fetch(`${apiBaseUrl()}/api/settings/alerts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d?.body?.message || `Failed (${res.status})`); setSaving(false); return }
      const saved = await res.json().catch(()=>payload)
      setAlerts(prev => Array.isArray(prev) ? [saved, ...prev] : [saved])
      setSaving(false)
    } catch(e) {
      setError(String(e)); setSaving(false)
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Connections</h1>
        <a href="/connections/new" style={{ textDecoration: 'none' }} className="badge" title="Add Connection">+ Add Connection</a>
      </div>
      {error && <p className="muted">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admin URL</th>
            <th>Kong Version</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.kong_admin_url}</td>
              <td>{c.kong_version}</td>
              <td>{c.active ? 'Yes' : 'No'}</td>
            </tr>
          ))}
          {!connections.length && (
            <tr>
              <td colSpan={4} className="muted">No connections found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Alert Triggers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label>Connection</label>
            <select className="form-control" value={alertForm.connectionId} onChange={(e)=>updateAlert('connectionId', e.target.value)}>
              {connections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label>Trigger</label>
            <select className="form-control" value={alertForm.type} onChange={(e)=>updateAlert('type', e.target.value)}>
              <option value="node_down">Node Down</option>
              <option value="latency_high">High Latency</option>
              <option value="error_rate_high">High Error Rate</option>
            </select>
          </div>
          {alertForm.type === 'latency_high' && (
            <div>
              <label>Latency Threshold (ms)</label>
              <input type="number" className="form-control" value={alertForm.latencyMs} onChange={(e)=>updateAlert('latencyMs', e.target.value)} />
            </div>
          )}
          {alertForm.type === 'error_rate_high' && (
            <div>
              <label>Error Rate Threshold (%)</label>
              <input type="number" className="form-control" value={alertForm.errorRatePct} onChange={(e)=>updateAlert('errorRatePct', e.target.value)} />
            </div>
          )}
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Recipients (comma separated emails)</label>
            <input className="form-control" value={alertForm.recipients} onChange={(e)=>updateAlert('recipients', e.target.value)} placeholder="admin@example.com, ops@example.com" />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={!!alertForm.enabled} onChange={(e)=>updateAlert('enabled', e.target.checked)} /> Enabled
            </label>
            <button className="sidebar-toggle" disabled={saving} onClick={saveAlert}>{saving ? 'Saving…' : 'Save Trigger'}</button>
          </div>
        </div>

        {!!alerts.length && (
          <div style={{ marginTop: 16 }}>
            <h4>Existing Triggers</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Connection</th>
                  <th>Type</th>
                  <th>Enabled</th>
                  <th>Recipients</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, idx) => (
                  <tr key={idx}>
                    <td>{connections.find(c=>String(c.id)===String(a.connectionId))?.name || a.connectionId}</td>
                    <td>{a.type}</td>
                    <td>{a.enabled ? 'Yes' : 'No'}</td>
                    <td>{a.config?.recipients || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
