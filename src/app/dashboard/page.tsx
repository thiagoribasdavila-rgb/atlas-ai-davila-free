'use client'

import { useEffect, useState } from 'react'
import { getLeads } from '@/services/leadsService'

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getLeads()
      setLeads(data)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>CRM D’Avila</h1>

      {loading ? (
        <p>Carregando leads...</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.nome}</td>
                <td>{lead.telefone}</td>
                <td>{lead.email}</td>
                <td>{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
