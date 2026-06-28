import { LeadStatus } from "./leads";

export const pipelineOrder: LeadStatus[] = [
  "novo",
  "contato",
  "visita",
  "proposta",
  "fechado",
  "perdido",
];

export function nextStatus(current: LeadStatus): LeadStatus {
  const index = pipelineOrder.indexOf(current);
  return pipelineOrder[Math.min(index + 1, pipelineOrder.length - 1)];
}
