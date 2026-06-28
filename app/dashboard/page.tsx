import { supabase } from '@/lib/supabase'

export default async function Dashboard() {
  const { data: leads } = await supabase.from('leads').select('*')

  return (
    <div style={{ padding: 30 }}>
      <h1>🚀 CRM Dashboard</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        <div>Leads: {leads?.length}</div>
        <div>Novos: {leads?.filter(l => l.stage === 'novo').length}</div>
        <div>Fechados: {leads?.filter(l => l.stage === 'fechado').length}</div>
      </div>
    </div>
  )
}
