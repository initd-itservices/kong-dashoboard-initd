import { apiFetch } from '../../lib/api'

export const dynamic = 'force-dynamic'

async function getUpstreams() {
  try { const res = await apiFetch('/kong/upstreams'); return Array.isArray(res) ? res : res.data || [] } catch { return [] }
}

export default async function UpstreamsPage() {
  const upstreams = await getUpstreams()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Upstreams</h1>
        <a href="/upstreams/new" className="badge">Create Upstream</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slots</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {upstreams.map((u) => (
            <tr key={u.id || u.name}>
              <td>{u.name}</td>
              <td>{u.slots}</td>
              <td>{Array.isArray(u.tags) ? u.tags.join(', ') : ''}</td>
            </tr>
          ))}
          {!upstreams.length && (
            <tr>
              <td colSpan={3} className="muted">No upstreams found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
