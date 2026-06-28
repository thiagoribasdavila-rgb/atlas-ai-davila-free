'use client'

import { useEffect, useState } from 'react'
import { getLeads, updateLead, Lead } from '@/services/leadsService'

const STATUS = ['novo', 'contato', 'proposta', 'fechado']

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await getLeads()
    setLeads(data || [])
  }

  async function moveLead(id: string, status: string) {
    await updateLead(id, { status })
    load()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        {STATUS.map((status) => (
          <div key={status} style={{ flex: 1 }}>
            <h3>{status.toUpperCase()}</h3>

            {leads
              .filter((l) => l.status === status)
              .map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    padding: 10,
                    marginBottom: 10,
                    border: '1px solid #ccc',
                    borderRadius: 8
                  }}
                >
                  <strong>{lead.nome}</strong>
                  <p>{lead.telefone}</p>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      moveLead(lead.id!, e.target.value)
                    }
                  >
                    {STATUS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
