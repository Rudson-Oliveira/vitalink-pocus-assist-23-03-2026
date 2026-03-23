export interface Paciente {
  id: string;
  criado_por: string;
  nome: string;
  idade: number | null;
  sexo: string;
  created_at: string;
}

export interface Caso {
  id: string;
  criado_por: string;
  paciente_id: string;
  titulo: string;
  queixa_principal: string;
  contexto_clinico: string;
  orgao_alvo: string;
  tipo_exame: string;
  limitacoes_exame: string;
  hipotese_clinica: string | null;
  status: "rascunho" | "em_analise" | "concluido";
  nota_operador: string | null;
  created_at: string;
  updated_at: string;
  pacientes?: Paciente;
}

export interface Frame {
  id: string;
  caso_id: string;
  criado_por: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  tamanho_bytes: number;
  ordem: number;
  legenda: string | null;
  orgao_referencia: string | null;
  uploaded_at: string;
}

export interface Analise {
  id: string;
  caso_id: string;
  frame_id: string;
  criado_por: string;
  modelo: string;
  prompt_usado: string;
  estruturas_visiveis: string;
  qualidade_tecnica: string;
  score_qualidade: number;
  achados_possiveis: string;
  diferenciais: string;
  o_que_falta: string;
  ajustes_tecnicos: string;
  grau_confianca: "baixo" | "moderado" | "alto";
  disclaimer: string;
  resposta_bruta: string | null;
  created_at: string;
}

export interface AnaliseResponse {
  estruturas_visiveis: string;
  qualidade_tecnica: string;
  score_qualidade: number;
  achados_possiveis: string;
  diferenciais: string;
  o_que_falta: string;
  ajustes_tecnicos: string;
  grau_confianca: "baixo" | "moderado" | "alto";
}
