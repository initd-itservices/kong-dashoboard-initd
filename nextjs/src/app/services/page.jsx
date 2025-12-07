import { apiFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

async function getServices() {
  try {
    const res = await apiFetch('/kong/services');
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Services</h1>
        <a href="/services/new" style={{ textDecoration: 'none' }} className="badge">Create Service</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name / ID</th>
            <th>Host</th>
            <th>Protocol</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td><a href={`/services/${s.id}`}>{s.name || s.id}</a></td>
              <td>{s.host}</td>
              <td>{s.protocol}</td>
              <td>{s.port}</td>
            </tr>
          ))}
          {!services.length && (
            <tr>
              <td colSpan={4} className="muted">No services found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
