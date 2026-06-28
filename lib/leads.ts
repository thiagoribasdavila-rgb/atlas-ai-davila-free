export type LeadStatus =
  | "novo"
  | "contato"
  | "visita"
  | "proposta"
  | "fechado"
  | "perdido";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interest: string; // imóvel ou tipo
  status: LeadStatus;
  createdAt: string;
};

const LEADS_KEY = "crm_leads";

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
}

export function saveLead(lead: Lead) {
  const leads = getLeads();
  localStorage.setItem(LEADS_KEY, JSON.stringify([...leads, lead]));
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = getLeads().map((lead) =>
    lead.id === id ? { ...lead, status } : lead
  );

  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}
