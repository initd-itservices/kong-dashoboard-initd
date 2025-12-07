import { apiFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

async function getConsumers() {
  try {
    const res = await apiFetch('/kong/consumers');
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function ConsumersPage() {
  const consumers = await getConsumers()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Consumers</h1>
        <a href="/consumers/new" style={{ textDecoration: 'none' }} className="badge">Create Consumer</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Username / ID</th>
            <th>Custom ID</th>
          </tr>
        </thead>
        <tbody>
          {consumers.map((c) => (
            <tr key={c.id}>
              <td><a href={`/consumers/${c.id}`}>{c.username || c.id}</a></td>
              <td>{c.custom_id}</td>
            </tr>
          ))}
          {!consumers.length && (
            <tr>
              <td colSpan={2} className="muted">No consumers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
