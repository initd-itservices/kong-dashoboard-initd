import { apiFetch } from '../../../lib/api';

export const dynamic = 'force-dynamic';

async function getRoute(id) {
  const r = await apiFetch(`/kong/routes/${id}`);
  return r;
}

async function getRoutePlugins(id) {
  try {
    const res = await apiFetch(`/kong/routes/${id}/plugins`);
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function RouteDetail({ params }) {
  const { id } = params;
  const route = await getRoute(id);
  const plugins = await getRoutePlugins(id);

  return (
    <div className="card">
      <h1 className="title">Route {route.name || route.id}</h1>
      <pre>{JSON.stringify(route, null, 2)}</pre>
      <h2 className="subtitle">Plugins</h2>
      {plugins.length ? (
        <ul>
          {plugins.map((p) => (
            <li key={p.id}>
              <span className="badge">{p.name}</span> {p.enabled ? '' : '(disabled)'}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No plugins.</p>
      )}
    </div>
  )
}
