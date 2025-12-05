import { apiFetch } from '../../lib/api';

export const dynamic = 'force-dynamic';

async function getRoutes() {
  try {
    const res = await apiFetch('/kong/routes');
    return Array.isArray(res) ? res : res.data || [];
  } catch (e) {
    return [];
  }
}

function cell(val) {
  if (Array.isArray(val)) return val.join(', ');
  return val ?? '';
}

export default async function RoutesPage() {
  const routes = await getRoutes()
  return (
    <div className="card">
      <h1 className="title">Routes</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name / ID</th>
            <th>Hosts</th>
            <th>Paths</th>
            <th>Methods</th>
            <th>Protocols</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id}>
              <td><a href={`/routes/${r.id}`}>{r.name || r.id}</a></td>
              <td>{cell(r.hosts)}</td>
              <td>{cell(r.paths)}</td>
              <td>{cell(r.methods)}</td>
              <td>{cell(r.protocols)}</td>
            </tr>
          ))}
          {!routes.length && (
            <tr>
              <td colSpan={5} className="muted">No routes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
