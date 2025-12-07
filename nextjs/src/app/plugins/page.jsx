import { apiFetch } from '../../lib/api'

export const dynamic = 'force-dynamic'

async function getPlugins() {
  try {
    const res = await apiFetch('/kong/plugins')
    return Array.isArray(res) ? res : res.data || []
  } catch (e) {
    return []
  }
}

export default async function PluginsPage() {
  const plugins = await getPlugins()
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Plugins</h1>
        <a href="/plugins/new" style={{ textDecoration: 'none' }} className="badge">Add Plugin</a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scope</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((p) => {
            const scope = p.service?.id ? 'Service' : p.route?.id ? 'Route' : p.consumer?.id ? 'Consumer' : 'Global'
            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{scope}</td>
                <td>{p.enabled ? 'Yes' : 'No'}</td>
              </tr>
            )
          })}
          {!plugins.length && (
            <tr>
              <td colSpan={3} className="muted">No plugins found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Add Global Plugins</h3>
          <a href="/plugins/new?scope=global" className="badge" style={{ textDecoration: 'none' }}>+ Add Global Plugin</a>
        </div>
        <p className="muted">Browse plugins grouped by tags. Click a plugin to prefill the form.</p>
        {(() => {
          const groups = {
            'Authentication': ['key-auth', 'jwt', 'basic-auth', 'oauth2'],
            'Security': ['acl', 'ip-restriction', 'bot-detection'],
            'Traffic control': ['rate-limiting', 'request-size-limiting', 'response-ratelimiting', 'request-termination'],
            'Serverless': ['pre-function', 'post-function', 'serverless-functions'],
            'Analytics & Monitoring': ['prometheus', 'statsd', 'datadog'],
            'Transformations': ['request-transformer', 'response-transformer', 'correlation-id'],
            'Logging': ['file-log', 'http-log', 'tcp-log', 'udp-log', 'syslog'],
            'Others': ['gzip', 'aws-lambda', 'azure-functions']
          }
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {Object.entries(groups).map(([tag, items]) => (
                <div key={tag} className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <img src="/assets/images/icons/plugins-icon.png" alt="" width="18" height="18" />
                    <strong>{tag}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                    {items.map(name => (
                      <a key={name} href={`/plugins/new?name=${encodeURIComponent(name)}&scope=global`} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src="/assets/images/icons/plugins-icon.png" alt="" width="16" height="16" />
                        <span>{name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
