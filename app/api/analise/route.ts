import { NextRequest, NextResponse } from "next/server";
import { analisarFrame } from "@/lib/groq";
import { buildPromptClinico } from "@/lib/prompts";
import { DISCLAIMER_MEDICO } from "@/lib/constants";
import type { AnaliseResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, orgao, queixa, contextoClinico, hipotese, limitacoes } = body;

    if (!imageBase64 || !orgao || !queixa || !contextoClinico) {
      return NextResponse.json({ error: "Campos obrigatorios ausentes" }, { status: 400 });
    }

    const prompt = buildPromptClinico({ orgao, queixa, contextoClinico, hipotese, limitacoes });
    const respostaBruta = await analisarFrame(imageBase64, prompt);

    let analise: AnaliseResponse;
    try {
      const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
      analise = JSON.parse(jsonMatch ? jsonMatch[0] : respostaBruta);
    } catch {
      analise = {
        estruturas_visiveis: "Nao foi possivel interpretar a resposta da IA",
        qualidade_tecnica: "Indeterminada",
        score_qualidade: 1,
        achados_possiveis: "Analise manual necessaria",
        diferenciais: "Nao disponivel",
        o_que_falta: "Repetir analise com imagem melhor",
        ajustes_tecnicos: "Verificar qualidade da imagem enviada",
        grau_confianca: "baixo",
      };
    }

    return NextResponse.json({
      ...analise,
      disclaimer: DISCLAIMER_MEDICO,
      prompt_usado: prompt,
      resposta_bruta: respostaBruta,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
