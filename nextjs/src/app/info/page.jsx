import { apiFetch } from '../../lib/api'

export const dynamic = 'force-dynamic'

async function getConnections() {
  try {
    const d = await apiFetch('/api/kongnode')
    return Array.isArray(d) ? d : d.data || []
  } catch { return [] }
}

async function getStatus() {
  try { return await apiFetch('/kong/status') } catch { return {} }
}
async function getNodeInfo() {
  try { return await apiFetch('/kong') } catch { return {} }
}
async function getTimers() {
  try { return await apiFetch('/kong/timers') } catch { return {} }
}
async function getEnabledPlugins() {
  try { return await apiFetch('/kong/plugins/enabled') } catch { return {} }
}
async function getConfiguredPlugins() {
  try {
    const p = await apiFetch('/kong/plugins')
    return Array.isArray(p) ? p : p.data || []
  } catch { return [] }
}

export default async function InfoPage() {
  const [connections, status, nodeInfo, timers, enabled, configured] = await Promise.all([
    getConnections(),
    getStatus(),
    getNodeInfo(),
    getTimers(),
    getEnabledPlugins(),
    getConfiguredPlugins(),
  ])

  const total = connections.length
  const active = connections.find(c => c.active)
  const server = status?.server || {}
  const db = status?.database || {}
  const infoVersion = nodeInfo?.version || active?.kong_version || 'Unknown'

  const runningTimers = timers?.running ?? timers?.running_timers ?? 0
  const pendingTimers = timers?.pending ?? timers?.pending_timers ?? 0

  const enabledList = enabled?.enabled_plugins || enabled?.plugins || []
  const configuredCount = Array.isArray(configured) ? configured.length : 0

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Information</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="card" style={{ padding: 12 }}>
          <strong>Connections</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            <div><div className="muted">Active</div><div>{server.connections_active ?? '—'}</div></div>
            <div><div className="muted">Reading</div><div>{server.connections_reading ?? '—'}</div></div>
            <div><div className="muted">Writing</div><div>{server.connections_writing ?? '—'}</div></div>
            <div><div className="muted">Waiting</div><div>{server.connections_waiting ?? '—'}</div></div>
            <div><div className="muted">Accepted</div><div>{server.connections_accepted ?? '—'}</div></div>
            <div><div className="muted">Handled</div><div>{server.connections_handled ?? '—'}</div></div>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Node Information</strong>
          <div style={{ marginTop: 8 }}>
            <div className="muted">Hostname</div>
            <div>{nodeInfo?.hostname || 'Unknown'}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="muted">Version</div>
            <div>{infoVersion}</div>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Datastore</strong>
          <div style={{ marginTop: 8 }}>
            <div className="muted">Reachable</div>
            <div>{db?.reachable === false ? 'No' : db?.reachable === true ? 'Yes' : 'Unknown'}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="muted">Database</div>
            <div>{nodeInfo?.configuration?.database || 'postgres'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
        <div className="card" style={{ padding: 12 }}>
          <strong>Timers</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div><div className="muted">Running</div><div>{runningTimers}</div></div>
            <div><div className="muted">Pending</div><div>{pendingTimers}</div></div>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Plugins</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div><div className="muted">Available</div><div>{Array.isArray(enabledList) ? enabledList.length : 0}</div></div>
            <div><div className="muted">Configured</div><div>{configuredCount}</div></div>
          </div>
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Active Gateway</strong>
          <div style={{ marginTop: 8 }}>{active ? (active.name || active.kong_admin_url) : 'None'}</div>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Gateways</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admin URL</th>
            <th>Version</th>
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
    </div>
  )
}
