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
  propertyId?: string;
  status: LeadStatus;
  ownerId: string;
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

export function updateLead(id: string, data: Partial<Lead>) {
  const leads = getLeads().map((l) =>
    l.id === id ? { ...l, ...data } : l
  );

  localStorage.setItem(KEY, JSON.stringify(leads));
}
