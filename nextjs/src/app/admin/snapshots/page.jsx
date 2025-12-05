import { apiFetch } from '../../../lib/api'

export const dynamic = 'force-dynamic'

async function getSnapshots() {
  try { const res = await apiFetch('/api/snapshots'); return Array.isArray(res) ? res : res.data || [] } catch { return [] }
}

export default async function SnapshotsPage() {
  const snapshots = await getSnapshots()
  return (
    <div className="card">
      <h1 className="title">Snapshots</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((s) => (
            <tr key={s.id}>
              <td>{s.name || s.id}</td>
              <td>{s.status}</td>
              <td>{s.createdAt}</td>
            </tr>
          ))}
          {!snapshots.length && (
            <tr>
              <td colSpan={3} className="muted">No snapshots found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
