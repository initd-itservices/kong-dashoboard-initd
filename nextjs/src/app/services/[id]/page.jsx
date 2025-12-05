import { apiFetch } from '../../../lib/api';

export const dynamic = 'force-dynamic';

async function getService(id) {
  return apiFetch(`/kong/services/${id}`);
}

async function getServiceRoutes(id) {
  try {
    const res = await apiFetch(`/kong/services/${id}/routes`);
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function ServiceDetail({ params }) {
  const { id } = params;
  const service = await getService(id);
  const routes = await getServiceRoutes(id);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Service {service.name || service.id}</h1>
        <a href={`/services/${id}/routes/new`} className="badge">Create Route</a>
      </div>
      <pre>{JSON.stringify(service, null, 2)}</pre>
      <h2 className="subtitle">Routes</h2>
      {routes.length ? (
        <ul>
          {routes.map((r) => (
            <li key={r.id}>
              <a href={`/routes/${r.id}`}>{r.name || r.id}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No routes.</p>
      )}
    </div>
  )
}
