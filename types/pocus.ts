export type CasoStatus = "novo" | "em_andamento" | "concluido";

export interface Caso {
  id: string;
  paciente_id: string;
  indicacao: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Frame {
  id: string;
  caso_id: string;
  image_url: string;
  tipo_exame: string | null;
  created_at: string;
}

export interface Analise {
  id: string;
  caso_id: string;
  frame_id: string | null;
  resultado: Record<string, unknown>;
  modelo: string | null;
  created_at: string;
}

export interface CasoCompleto extends Caso {
  frames: Frame[];
  analises: Analise[];
}

export interface NovoCasoInput {
  paciente_id: string;
  indicacao?: string;
  status?: string;
}

export interface NovoFrameInput {
  caso_id: string;
  image_url: string;
  tipo_exame?: string;
}

export interface NovaAnaliseInput {
  caso_id: string;
  frame_id?: string | null;
  resultado: Record<string, unknown>;
  modelo?: string;
}

export interface DashboardMetricas {
  totalCasos: number;
  totalFrames: number;
  totalAnalises: number;
  emAndamento: number;
}

export interface BackupPayload {
  version: string;
  generated_at: string;
  source: string;
  casos: Caso[];
  frames: Frame[];
  analises: Analise[];
}
