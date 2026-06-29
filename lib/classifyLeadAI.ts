import { openai } from "./ai";

export async function classifyLeadAI(lead: any) {
  const prompt = `
Você é um especialista em vendas imobiliárias.

Classifique esse lead:

Nome: ${lead.nome}
Telefone: ${lead.telefone}
Email: ${lead.email}

Responda APENAS com uma palavra:
- quente
- morno
- frio
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content?.trim();
}
