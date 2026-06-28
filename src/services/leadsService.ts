import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types/lead'

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro getLeads:', error)
    return []
  }

  return data as Lead[]
}

export async function createLead(lead: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()

  if (error) {
    console.error('Erro createLead:', error)
    return null
  }

  return data
}
