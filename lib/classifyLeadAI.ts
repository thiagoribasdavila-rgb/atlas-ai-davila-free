import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function classifyLeadAI(lead: {
  nome: string;
  telefone: string;
  email: string;
  origem: string;
}) {
  try {
    const prompt = `
Você é um especialista em vendas imobiliárias.

Classifique este lead em um dos status abaixo:

- novo
- contato
- proposta
- fechado

Regras:
- "novo" = apenas cadastro inicial
- "contato" = respondeu ou demonstrou interesse
- "proposta" = pediu valor ou condições
- "fechado" = já decidiu comprar

Lead:
Nome: ${lead.nome}
Telefone: ${lead.telefone}
Email: ${lead.email}
Origem: ${lead.origem}

Responda APENAS com uma palavra.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content
      ?.toLowerCase()
      .trim();

    if (
      result === "novo" ||
      result === "contato" ||
      result === "proposta" ||
      result === "fechado"
    ) {
      return result;
    }

    return "novo";
  } catch (error) {
    console.error("IA error:", error);
    return "novo";
  }
}
