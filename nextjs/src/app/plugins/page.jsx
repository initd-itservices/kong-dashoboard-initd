import { apiFetch } from '../../lib/api'

export const dynamic = 'force-dynamic'

async function getPlugins() {
  try {
    const res = await apiFetch('/kong/plugins')
    return Array.isArray(res) ? res : res.data || []
  } catch (e) {
    return []
  }
}

export default async function PluginsPage() {
  const plugins = await getPlugins()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Plugins</h1>
        <a href="/plugins/new" style={{ textDecoration: 'none' }} className="badge">Add Plugin</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scope</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((p) => {
            const scope = p.service?.id ? 'Service' : p.route?.id ? 'Route' : p.consumer?.id ? 'Consumer' : 'Global'
            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{scope}</td>
                <td>{p.enabled ? 'Yes' : 'No'}</td>
              </tr>
            )
          })}
          {!plugins.length && (
            <tr>
              <td colSpan={3} className="muted">No plugins found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
