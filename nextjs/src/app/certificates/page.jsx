import { apiFetch } from '../../lib/api'

export const dynamic = 'force-dynamic'

async function getCertificates() {
  try { const res = await apiFetch('/kong/certificates'); return Array.isArray(res) ? res : res.data || [] } catch { return [] }
}

export default async function CertificatesPage() {
  const certs = await getCertificates()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Certificates</h1>
        <a href="/certificates/new" style={{ textDecoration: 'none' }} className="badge">Add Certificate</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>SNIs</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {certs.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{Array.isArray(c.snis) ? c.snis.join(', ') : ''}</td>
              <td>{c.created_at}</td>
            </tr>
          ))}
          {!certs.length && (
            <tr>
              <td colSpan={3} className="muted">No certificates found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
