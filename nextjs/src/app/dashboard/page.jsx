'use client'
import { useEffect, useRef, useState } from 'react'
import { apiBaseUrl } from '../../lib/api'

function Sparkline({ data = [], color = '#2563EB' }) {
  const width = 240
  const height = 60
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width
    const y = height - (v / max) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export default function DashboardPage() {
  const [status, setStatus] = useState(null)
  const [nodeInfo, setNodeInfo] = useState(null)
  const reqRate = useRef([])
  const errRate = useRef([])
  const latencyVals = useRef([])
  const connActive = useRef([])

  useEffect(() => {
    let timer
    async function tick() {
      try {
        const base = apiBaseUrl()
        const s = await fetch(`${base}/kong/status`).then(r=>r.json())
        const i = await fetch(`${base}/kong`).then(r=>r.json()).catch(()=>null)
        setStatus(s)
        setNodeInfo(i)
        const server = s?.server || {}
        const accepted = Number(server.connections_accepted || 0)
        const active = Number(server.connections_active || 0)
        const reading = Number(server.connections_reading || 0)
        const writing = Number(server.connections_writing || 0)
        const waiting = Number(server.connections_waiting || 0)
        connActive.current = [...connActive.current.slice(-19), active]
        reqRate.current = [...reqRate.current.slice(-19), accepted]
        errRate.current = [...errRate.current.slice(-19), Math.max(0, waiting - reading)]
        latencyVals.current = [...latencyVals.current.slice(-19), Math.max(0, writing * 10)]
      } catch {}
      timer = setTimeout(tick, 10000)
    }
    tick()
    return () => { if (timer) clearTimeout(timer) }
  }, [])

  const version = nodeInfo?.version || 'Unknown'
  const server = status?.server || {}

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title">Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div className="card" style={{ padding: 12 }}>
          <strong>Request Rate</strong>
          <Sparkline data={reqRate.current} color="var(--brand)" />
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Error Rate</strong>
          <Sparkline data={errRate.current} color="#ef4444" />
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Latency</strong>
          <Sparkline data={latencyVals.current} color="#f59e0b" />
        </div>
        <div className="card" style={{ padding: 12 }}>
          <strong>Active Connections</strong>
          <Sparkline data={connActive.current} color="var(--brand-dark)" />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, padding: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <div className="muted">Version</div>
            <div>{version}</div>
          </div>
          <div>
            <div className="muted">Active</div>
            <div>{server.connections_active ?? '—'}</div>
          </div>
          <div>
            <div className="muted">Reading</div>
            <div>{server.connections_reading ?? '—'}</div>
          </div>
          <div>
            <div className="muted">Writing</div>
            <div>{server.connections_writing ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
