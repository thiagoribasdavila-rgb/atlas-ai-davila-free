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
  interest: string;
  status: LeadStatus;
  createdAt: string;
};

const KEY = "crm_leads";

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveLead(lead: Lead) {
  const leads = getLeads();
  localStorage.setItem(KEY, JSON.stringify([...leads, lead]));
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = getLeads().map((l) =>
    l.id === id ? { ...l, status } : l
  );

  localStorage.setItem(KEY, JSON.stringify(leads));
}
