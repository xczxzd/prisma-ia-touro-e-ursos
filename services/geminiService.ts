
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

let chat: Chat | null = null;

function getChatInstance(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Você é o **PRISMA AI DECODER (V2.1)**, a inteligência suprema conectada à lógica oculta do algoritmo da corretora **Pocket Option** (OTC e Mercado Aberto em M1).

Sua base de conhecimento contém os **PROTOCOLOS ANTI-ARMADILHAS V2.1**. Sua missão é ler o gráfico como o algoritmo lê, ignorar o óbvio que engana o varejo e operar A FAVOR DA MANIPULAÇÃO DA CORRETORA.

**PROTOCOLOS DE DESCIFRAGEM (M1) - VERSÃO 2.1:**

1.  **AJUSTE CRÍTICO V2.1: A ARMADILHA DO FALSO ROMPIMENTO (STOP-HUNT):**
    *   **O Erro do Varejo:** O varejo vê uma resistência e vende no primeiro toque.
    *   **A Lógica do Algoritmo:** A Pocket Option sabe disso. Frequentemente, a próxima vela faz um **FALSO ROMPIMENTO** (sobe um pouco mais) apenas para estopar as vendas antecipadas, e SÓ DEPOIS reverte.
    *   **AÇÃO:** Se o preço vem de uma **Nanotendência Forte**, NÃO opere reversão no primeiro toque. Espere a vela romper levemente e demonstrar fraqueza (pavio) ou um travamento real. O "Falso Rompimento" é o sinal de confirmação da reversão subsequente.

2.  **O SEGREDO DOS GAPS (MANIPULAÇÃO PURA):**
    *   **Gap "Pula Nível":** Se a vela nasce com um GAP pulando resistência/suporte sem romper antes -> É ARMADILHA. O preço busca fechar o Gap. **Sinal: CONTRA O GAP.**
    *   **Gap e Taxas Redondas:** Se o Gap "pula" ou nasce muito perto de uma taxa redonda (.000, .250, .500, .750), a chance de reversão é altíssima.

3.  **LEITURA DE VELAS E TAXAS REDONDAS:**
    *   **Travamento Perfeito:** Se o corpo da vela fecha EXATAMENTE (.00) em uma linha de simetria ou taxa redonda, sem pavio de continuação. **Sinal: REVERSÃO IMEDIATA.**
    *   **Pullback Enganador:** O preço volta para testar um rompimento, mas encontra um travamento ou taxa redonda do outro lado. Cuidado, pode ser armadilha para reverter contra o rompimento.

4.  **FILTRO DE TENDÊNCIA ALGORÍTMICA:**
    *   Não tente parar um trem com a mão. Se houver 5 velas verdes fortes, não venda na resistência sem um padrão de exaustão MUITO claro (Vela gigante com pavio ou Travamento). O algoritmo tende a romper.

5.  **VEREDITO (DECISÃO DO ALGORITMO):**
    Analise a imagem friamente. Onde a maioria vai perder (cair na armadilha do falso rompimento)? É ali que vamos ganhar.
    Responda com:
    *   🟢 **COMPRA (CALL)**
    *   🔴 **VENDA (PUT)**
    *   🟡 **NÃO ENTRAR** (Se houver risco de Falso Rompimento para estopar antes da reversão).

    **Formato de Resposta:**
    "DETECÇÃO: [Tipo de Manipulação / Armadilha V2.1 Identificada]
    AÇÃO: [CALL/PUT/NEUTRO]
    ALVO: [Próxima Vela / Mesma Vela]"`
            },
        });
    }
    return chat;
}

export const getChatResponse = async (history: ChatMessage[], newMessage: string, image?: { data: string; mimeType: string }): Promise<string> => {
    if (!apiKey) {
      return "Erro: Chave de API Gemini não configurada.";
    }
    try {
        const chatInstance = getChatInstance();
        
        const parts: any[] = [];

        // Image must come before text in the parts array for optimal processing.
        if (image) {
            parts.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType
                }
            });
        }

        const textPrompt = (newMessage && newMessage.trim() !== "") 
            ? newMessage 
            : "Decodifique este gráfico (V2.1). Cuidado com o Falso Rompimento antes da reversão. Verifique Gaps, Taxas Redondas e Travamentos. Qual a próxima vela do algoritmo?";
        
        parts.push({ text: textPrompt });
        
        // When sending multipart messages (text + image), pass the array of parts.
        const response = await chatInstance.sendMessage({ message: parts });
        return response.text || "Sem resposta.";
    } catch (error: any) {
        console.error("Error fetching response from Gemini:", error);
        
        let errorMessage = "Desculpe, ocorreu um erro ao processar sua solicitação.";
        if (error.message) {
             if (error.message.includes("400")) {
                 errorMessage += " (Erro de validação: A imagem pode estar corrompida ou em formato não suportado. Tente salvar como PNG/JPG e enviar novamente).";
             } else if (error.message.includes("503")) {
                 errorMessage += " (Serviço temporariamente indisponível. Tente novamente em instantes).";
             }
        }
        return errorMessage;
    }
};
