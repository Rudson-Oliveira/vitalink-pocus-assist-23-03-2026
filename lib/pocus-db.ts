import { supabase } from "@/lib/supabase";
import type {
  Analise,
  BackupPayload,
  Caso,
  CasoCompleto,
  DashboardMetricas,
  Frame,
  NovaAnaliseInput,
  NovoCasoInput,
  NovoFrameInput,
} from "@/types/pocus";

function normalizarErro(error: unknown, contexto: string): never {
  if (error && typeof error === "object" && "message" in error) {
    throw new Error(`${contexto}: ${(error as { message: string }).message}`);
  }
  throw new Error(`${contexto}: erro desconhecido`);
}

function escapeLike(value: string): string {
  return value.replace(/[%_,]/g, "");
}

export async function listarCasos(busca?: string): Promise<Caso[]> {
  let query = supabase
    .from("casos")
    .select("*")
    .order("created_at", { ascending: false });

  if (busca && busca.trim()) {
    const termo = escapeLike(busca.trim());
    query = query.or(
      `paciente_id.ilike.%${termo}%,indicacao.ilike.%${termo}%,status.ilike.%${termo}%`
    );
  }

  const { data, error } = await query;
  if (error) normalizarErro(error, "Falha ao listar casos");
  return (data ?? []) as Caso[];
}

export async function buscarCasoPorId(casoId: string): Promise<Caso | null> {
  const { data, error } = await supabase
    .from("casos")
    .select("*")
    .eq("id", casoId)
    .maybeSingle();

  if (error) normalizarErro(error, "Falha ao buscar caso");
  return (data as Caso | null) ?? null;
}

export async function criarCaso(input: NovoCasoInput): Promise<Caso> {
  const payload = {
    paciente_id: input.paciente_id,
    indicacao: input.indicacao?.trim() ? input.indicacao.trim() : null,
    status: input.status ?? "novo",
  };

  const { data, error } = await supabase
    .from("casos")
    .insert(payload)
    .select()
    .single();

  if (error) normalizarErro(error, "Falha ao criar caso");
  return data as Caso;
}

export async function atualizarStatusCaso(casoId: string, status: string): Promise<Caso> {
  const { data, error } = await supabase
    .from("casos")
    .update({ status })
    .eq("id", casoId)
    .select()
    .single();

  if (error) normalizarErro(error, "Falha ao atualizar status do caso");
  return data as Caso;
}

export async function excluirCaso(casoId: string): Promise<void> {
  const { error } = await supabase
    .from("casos")
    .delete()
    .eq("id", casoId);

  if (error) normalizarErro(error, "Falha ao excluir caso");
}

export async function listarFramesDoCaso(casoId: string): Promise<Frame[]> {
  const { data, error } = await supabase
    .from("frames")
    .select("*")
    .eq("caso_id", casoId)
    .order("created_at", { ascending: false });

  if (error) normalizarErro(error, "Falha ao listar frames");
  return (data ?? []) as Frame[];
}

export async function criarFrame(input: NovoFrameInput): Promise<Frame> {
  const payload = {
    caso_id: input.caso_id,
    image_url: input.image_url,
    tipo_exame: input.tipo_exame?.trim() ? input.tipo_exame.trim() : null,
  };

  const { data, error } = await supabase
    .from("frames")
    .insert(payload)
    .select()
    .single();

  if (error) normalizarErro(error, "Falha ao criar frame");
  return data as Frame;
}

export async function excluirFrame(frameId: string): Promise<void> {
  const { error } = await supabase
    .from("frames")
    .delete()
    .eq("id", frameId);

  if (error) normalizarErro(error, "Falha ao excluir frame");
}

export async function listarAnalisesDoCaso(casoId: string): Promise<Analise[]> {
  const { data, error } = await supabase
    .from("analises")
    .select("*")
    .eq("caso_id", casoId)
    .order("created_at", { ascending: false });

  if (error) normalizarErro(error, "Falha ao listar análises");
  return (data ?? []) as Analise[];
}

export async function criarAnalise(input: NovaAnaliseInput): Promise<Analise> {
  const payload = {
    caso_id: input.caso_id,
    frame_id: input.frame_id ?? null,
    resultado: input.resultado ?? {},
    modelo: input.modelo?.trim() ? input.modelo.trim() : null,
  };

  const { data, error } = await supabase
    .from("analises")
    .insert(payload)
    .select()
    .single();

  if (error) normalizarErro(error, "Falha ao criar análise");
  return data as Analise;
}

export async function excluirAnalise(analiseId: string): Promise<void> {
  const { error } = await supabase
    .from("analises")
    .delete()
    .eq("id", analiseId);

  if (error) normalizarErro(error, "Falha ao excluir análise");
}

export async function buscarCasoCompleto(casoId: string): Promise<CasoCompleto | null> {
  const caso = await buscarCasoPorId(casoId);
  if (!caso) return null;

  const [frames, analises] = await Promise.all([
    listarFramesDoCaso(casoId),
    listarAnalisesDoCaso(casoId),
  ]);

  return {
    ...caso,
    frames,
    analises,
  };
}

export async function obterDashboardMetricas(): Promise<DashboardMetricas> {
  const [
    casosResp,
    framesResp,
    analisesResp,
    emAndamentoResp,
  ] = await Promise.all([
    supabase.from("casos").select("*", { count: "exact", head: true }),
    supabase.from("frames").select("*", { count: "exact", head: true }),
    supabase.from("analises").select("*", { count: "exact", head: true }),
    supabase
      .from("casos")
      .select("*", { count: "exact", head: true })
      .eq("status", "em_andamento"),
  ]);

  if (casosResp.error) normalizarErro(casosResp.error, "Falha ao contar casos");
  if (framesResp.error) normalizarErro(framesResp.error, "Falha ao contar frames");
  if (analisesResp.error) normalizarErro(analisesResp.error, "Falha ao contar análises");
  if (emAndamentoResp.error) normalizarErro(emAndamentoResp.error, "Falha ao contar casos em andamento");

  return {
    totalCasos: casosResp.count ?? 0,
    totalFrames: framesResp.count ?? 0,
    totalAnalises: analisesResp.count ?? 0,
    emAndamento: emAndamentoResp.count ?? 0,
  };
}

export async function exportarBackupCompleto(): Promise<BackupPayload> {
  const [casosResp, framesResp, analisesResp] = await Promise.all([
    supabase.from("casos").select("*").order("created_at", { ascending: true }),
    supabase.from("frames").select("*").order("created_at", { ascending: true }),
    supabase.from("analises").select("*").order("created_at", { ascending: true }),
  ]);

  if (casosResp.error) normalizarErro(casosResp.error, "Falha ao exportar casos");
  if (framesResp.error) normalizarErro(framesResp.error, "Falha ao exportar frames");
  if (analisesResp.error) normalizarErro(analisesResp.error, "Falha ao exportar análises");

  return {
    version: "1.0.0",
    generated_at: new Date().toISOString(),
    source: "vitalink-pocus-assist",
    casos: (casosResp.data ?? []) as Caso[],
    frames: (framesResp.data ?? []) as Frame[],
    analises: (analisesResp.data ?? []) as Analise[],
  };
}

export async function restaurarBackupCompleto(payload: BackupPayload): Promise<void> {
  if (!payload || typeof payload !== "object") {
    throw new Error("Backup invalido.");
  }

  const casos = Array.isArray(payload.casos) ? payload.casos : [];
  const frames = Array.isArray(payload.frames) ? payload.frames : [];
  const analises = Array.isArray(payload.analises) ? payload.analises : [];

  const del1 = await supabase.from("analises").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (del1.error) normalizarErro(del1.error, "Falha ao limpar analises");

  const del2 = await supabase.from("frames").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (del2.error) normalizarErro(del2.error, "Falha ao limpar frames");

  const del3 = await supabase.from("casos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (del3.error) normalizarErro(del3.error, "Falha ao limpar casos");

  if (casos.length > 0) {
    const r = await supabase.from("casos").insert(casos);
    if (r.error) normalizarErro(r.error, "Falha ao restaurar casos");
  }

  if (frames.length > 0) {
    const r = await supabase.from("frames").insert(frames);
    if (r.error) normalizarErro(r.error, "Falha ao restaurar frames");
  }

  if (analises.length > 0) {
    const r = await supabase.from("analises").insert(analises);
    if (r.error) normalizarErro(r.error, "Falha ao restaurar analises");
  }
}
