import { supabase } from '@/lib/supabase'

export type Lead = {
  id?: string
  nome: string
  telefone?: string
  email?: string
  origem?: string
  status?: string
  valor_imovel?: number
  interesse?: string
  observacao?: string
  created_at?: string
}

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createLead(lead: Lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()

  if (error) throw error
  return data
}

export async function updateLead(id: string, lead: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update(lead)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}
