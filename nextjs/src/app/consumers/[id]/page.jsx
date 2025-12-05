import { apiFetch } from '../../../lib/api';

export const dynamic = 'force-dynamic';

async function getConsumer(id) {
  return apiFetch(`/kong/consumers/${id}`);
}

async function getAccessibleServices(id) {
  try {
    const res = await apiFetch(`/api/kong_consumers/${id}/services`);
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

async function getAccessibleRoutes(id) {
  try {
    const res = await apiFetch(`/api/kong_consumers/${id}/routes`);
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function ConsumerDetail({ params }) {
  const { id } = params;
  const consumer = await getConsumer(id);
  const services = await getAccessibleServices(id);
  const routes = await getAccessibleRoutes(id);

  return (
    <div className="card">
      <h1 className="title">Consumer {consumer.username || consumer.id}</h1>
      <pre>{JSON.stringify(consumer, null, 2)}</pre>
      <h2 className="subtitle">Accessible Services</h2>
      {services.length ? (
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              <a href={`/services/${s.id}`}>{s.name || s.id}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No services accessible.</p>
      )}
      <h2 className="subtitle">Accessible Routes</h2>
      {routes.length ? (
        <ul>
          {routes.map((r) => (
            <li key={r.id}>
              <a href={`/routes/${r.id}`}>{r.name || r.id}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No routes accessible.</p>
      )}
    </div>
  )
}
