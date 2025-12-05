import { apiFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

async function getConnections() {
  try {
    const data = await apiFetch('/api/kongnode');
    return Array.isArray(data) ? data : data.data || [];
  } catch (e) {
    return [];
  }
}

export default async function ConnectionsPage() {
  const connections = await getConnections()
  return (
    <div className="card">
      <h1 className="title">Connections</h1>
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
    </div>
  )
}
