export const APP_NAME = "VITALINK POCUS ASSIST";
export const APP_VERSION = "v0.1.0";

export const DISCLAIMER_MEDICO = `AVISO: Este sistema e de apoio educacional e triagem. NAO substitui avaliacao medica especializada. NAO emite laudo definitivo. Todas as hipoteses devem ser confirmadas por profissional habilitado. Use como segundo olhar, checklist e organizacao do raciocinio clinico.`;

export const ORGAOS_ALVO = [
  "Abdome geral",
  "Figado",
  "Vesicula biliar",
  "Rins",
  "Bexiga",
  "Baco",
  "Utero e anexos",
  "Obstetrico basico",
  "FAST trauma",
  "Liquido livre",
  "Outros",
] as const;

export const STATUS_CASO = {
  rascunho: { label: "Rascunho", color: "bg-yellow-500" },
  em_analise: { label: "Em Analise", color: "bg-blue-500" },
  concluido: { label: "Concluido", color: "bg-green-500" },
} as const;
