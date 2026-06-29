import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function scoreLeadAI(lead: any) {
  const prompt = `
Você é um especialista em vendas imobiliárias.

Dê uma nota de 0 a 100 para esse lead baseado na chance de compra.

Regras:
- 0-30 = frio
- 31-70 = morno
- 71-100 = quente

Lead:
Nome: ${lead.nome}
Telefone: ${lead.telefone}
Origem: ${lead.origem}

Responda apenas com um número.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const score = parseInt(res.choices[0].message.content || "0");

  return isNaN(score) ? 0 : score;
}
