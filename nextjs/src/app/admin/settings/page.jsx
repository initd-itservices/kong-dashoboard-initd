'use client'
import { useEffect, useState } from 'react'
import { apiBaseUrl } from '../../../lib/api'

function emptyConfig() {
  return {
    info_polling_interval: 0,
    baseUrl: '',
    signup_enable: true,
    signup_require_activation: false,
    email_default_sender_name: '',
    email_default_sender: '',
    default_transport: null,
    notify_when: {
      user_signup: { title: 'User signs up', description: 'A new user has signed up', active: false },
      node_down: { title: 'Node is down', description: 'A node is unreachable', active: false }
    },
    user_permissions: {
      services: { read: true, create: true, update: true, delete: false },
      routes: { read: true, create: true, update: true, delete: false },
      consumers: { read: true, create: true, update: true, delete: false }
    }
  }
}

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [settingsId, setSettingsId] = useState(null)
  const [config, setConfig] = useState(emptyConfig())
  const [transports, setTransports] = useState([])
  const [integrations, setIntegrations] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadAll() {
      try {
        const [settingsRes, transportsRes, integrationsRes] = await Promise.all([
          fetch(`${apiBaseUrl()}/api/settings`).then(r => r.json()).catch(() => []),
          fetch(`${apiBaseUrl()}/api/emailtransport`).then(r => r.json()).catch(() => []),
          fetch(`${apiBaseUrl()}/api/settings/integrations`).then(r => r.json()).catch(() => ({ data: [] }))
        ])
        const settingsList = Array.isArray(settingsRes) ? settingsRes : settingsRes.data || []
        const first = settingsList[0]
        if (first) {
          setSettingsId(first.id)
          setConfig(first.data || emptyConfig())
        }
        setTransports(Array.isArray(transportsRes) ? transportsRes : transportsRes.data || [])
        setIntegrations(integrationsRes.data || [])
        setLoaded(true)
      } catch (e) {
        setError(String(e))
      }
    }
    loadAll()
  }, [])

  function setConfigValue(path, value) {
    setConfig(prev => {
      const segs = path.split('.')
      const next = { ...prev }
      let obj = next
      for (let i = 0; i < segs.length - 1; i++) {
        const s = segs[i]
        obj[s] = obj[s] || {}
        obj = obj[s]
      }
      obj[segs[segs.length - 1]] = value
      return next
    })
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      if (settingsId) {
        const res = await fetch(`${apiBaseUrl()}/api/settings/${settingsId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { ...config, integrations } })
        })
        if (!res.ok) throw new Error(`Failed (${res.status})`)
      } else {
        const res = await fetch(`${apiBaseUrl()}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { ...config, integrations } })
        })
        if (!res.ok) throw new Error(`Failed (${res.status})`)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <div className="card"><p className="muted">Loading settings…</p></div>

  return (
    <div className="card">
      <h1 className="title">Settings</h1>
      {error && <p className="muted">{error}</p>}

      <h3>General settings</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Dashboard refresh interval</label>
          <input type="number" className="form-control" value={config.info_polling_interval || 0} onChange={(e) => setConfigValue('info_polling_interval', Number(e.target.value))} />
          <p className="muted">Milliseconds; set 0 to disable polling.</p>
        </div>
        <div>
          <label>Base URL</label>
          <input type="text" className="form-control" value={config.baseUrl || ''} onChange={(e) => setConfigValue('baseUrl', e.target.value)} placeholder="ex. http://my-konga.io" />
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Sign up restrictions</h3>
      <div>
        <label><input type="checkbox" checked={!!config.signup_enable} onChange={(e) => setConfigValue('signup_enable', e.target.checked)} /> Allow users to sign up</label>
        <br />
        <label><input type="checkbox" checked={!!config.signup_require_activation} onChange={(e) => setConfigValue('signup_require_activation', e.target.checked)} /> Send activation email</label>
      </div>

      <h3 style={{ marginTop: 24 }}>Notifications (Email)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Default sender name</label>
          <input className="form-control" value={config.email_default_sender_name || ''} onChange={(e) => setConfigValue('email_default_sender_name', e.target.value)} />
        </div>
        <div>
          <label>Default sender address</label>
          <input type="email" className="form-control" value={config.email_default_sender || ''} onChange={(e) => setConfigValue('email_default_sender', e.target.value)} />
        </div>
      </div>

      <h4 style={{ marginTop: 16 }}>Transports</h4>
      <p className="muted">Select the default transport. Configure transports in the legacy UI if needed.</p>
      <div>
        {transports.map((t) => (
          <label key={t.id} style={{ display: 'inline-block', marginRight: 12 }}>
            <input type="radio" name="default_transport" checked={config.default_transport === t.name} onChange={() => setConfigValue('default_transport', t.name)} /> {String(t.name).toUpperCase()}
          </label>
        ))}
      </div>

      <h3 style={{ marginTop: 24 }}>3rd-party Integrations</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {integrations.map((item, idx) => (
          <div key={item.id} className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{item.name || item.id}</strong>
              <label>
                <input type="checkbox" checked={!!item.config?.enabled} onChange={(e) => {
                  const enabled = e.target.checked
                  setIntegrations(prev => {
                    const next = [...prev]
                    next[idx] = { ...next[idx], config: { ...(next[idx].config || {}), enabled } }
                    return next
                  })
                  save()
                }} />
                <span style={{ marginLeft: 6 }}>Enabled</span>
              </label>
            </div>
            <p className="muted">Configure via legacy UI modal; toggling persists here.</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 24 }}>Notify Administrators when</h3>
      <table className="table">
        <tbody>
          {Object.entries(config.notify_when || {}).map(([key, value]) => (
            <tr key={key}>
              <td width="1">
                <input type="checkbox" checked={!!value.active} onChange={(e) => setConfigValue(`notify_when.${key}.active`, e.target.checked)} />
              </td>
              <td>
                <div><strong>{value.title}</strong></div>
                <div className="muted">{value.description}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>User permissions</h3>
      {Object.entries(config.user_permissions || {}).map(([context, perms]) => (
        <div key={context} style={{ marginBottom: 8 }}>
          <strong>{context.toUpperCase()}</strong>
          <div className="well" style={{ padding: 8 }}>
            {Object.keys(perms).map((p) => (
              <label key={p} className="checkbox-inline" style={{ marginRight: 12 }}>
                <input type="checkbox" checked={!!config.user_permissions[context][p]} onChange={(e) => setConfigValue(`user_permissions.${context}.${p}`, e.target.checked)} /> {p}
              </label>
            ))}
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Theme</h3>
      <div>
        <label style={{ marginRight: 12 }}>
          <input type="radio" name="theme" checked={(config.theme || 'light') === 'light'} onChange={() => { setConfigValue('theme', 'light'); localStorage.setItem('theme', 'light'); document.documentElement.setAttribute('data-theme', 'light') }} /> Light
        </label>
        <label style={{ marginRight: 12 }}>
          <input type="radio" name="theme" checked={config.theme === 'dark'} onChange={() => { setConfigValue('theme', 'dark'); localStorage.setItem('theme', 'dark'); document.documentElement.setAttribute('data-theme', 'dark') }} /> Dark
        </label>
        <label>
          <input type="radio" name="theme" checked={config.theme === 'night'} onChange={() => { setConfigValue('theme', 'night'); localStorage.setItem('theme', 'night'); document.documentElement.setAttribute('data-theme', 'night') }} /> Night
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="sidebar-toggle" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </div>
    </div>
  )
}
