'use client'

import { useState } from 'react'
import { createLead } from '@/services/leadsService'

export default function LeadForm() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  async function handleSubmit() {
    await createLead({
      nome,
      telefone,
      status: 'novo',
      origem: 'site'
    })

    alert('Lead criado!')
    setNome('')
    setTelefone('')
  }

  return (
    <div>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Criar Lead
      </button>
    </div>
  )
}
