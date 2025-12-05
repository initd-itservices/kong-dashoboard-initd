import { apiFetch } from '../../../lib/api'

export const dynamic = 'force-dynamic'

async function getUsers() {
  try { const res = await apiFetch('/api/users'); return Array.isArray(res) ? res : res.data || [] } catch { return [] }
}

export default async function UsersPage() {
  const users = await getUsers()
  return (
    <div className="card">
      <h1 className="title">Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{[u.firstName, u.lastName].filter(Boolean).join(' ')}</td>
              <td>{u.createdAt}</td>
            </tr>
          ))}
          {!users.length && (
            <tr>
              <td colSpan={3} className="muted">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
