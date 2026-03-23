"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { criarCaso } from "@/lib/pocus-db";

function formatarIndicacaoCompleta(data: {
  nomePaciente: string;
  idade: string;
  sexo: string;
  indicacaoClinica: string;
  janelaAcustica: string;
  achados: string;
  imagemNome: string;
}) {
  return [
    `Paciente: ${data.nomePaciente}`,
    `Idade: ${data.idade}`,
    `Sexo: ${data.sexo}`,
    `Indicação clínica: ${data.indicacaoClinica}`,
    `Janela acústica: ${data.janelaAcustica}`,
    `Achados: ${data.achados}`,
    `Imagem: ${data.imagemNome || "não enviada"}`,
  ].join(" | ");
}

export default function NovoCasoPage() {
  const router = useRouter();

  const [nomePaciente, setNomePaciente] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [indicacaoClinica, setIndicacaoClinica] = useState("");
  const [janelaAcustica, setJanelaAcustica] = useState("");
  const [achados, setAchados] = useState("");
  const [status, setStatus] = useState("novo");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const validacoes = useMemo(() => {
    return {
      nomePaciente: nomePaciente.trim().length >= 3,
      idade: /^\d{1,3}$/.test(idade.trim()) && Number(idade) >= 0 && Number(idade) <= 120,
      sexo: !!sexo,
      indicacaoClinica: indicacaoClinica.trim().length >= 5,
      janelaAcustica: janelaAcustica.trim().length >= 3,
      achados: achados.trim().length >= 3,
    };
  }, [nomePaciente, idade, sexo, indicacaoClinica, janelaAcustica, achados]);

  const formValido = Object.values(validacoes).every(Boolean);

  async function handleSalvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formValido) {
      toast.error("Formulário incompleto", {
        description: "Preencha todos os campos obrigatórios antes de salvar.",
      });
      return;
    }

    try {
      setSalvando(true);

      const indicacaoCompleta = formatarIndicacaoCompleta({
        nomePaciente: nomePaciente.trim(),
        idade: idade.trim(),
        sexo,
        indicacaoClinica: indicacaoClinica.trim(),
        janelaAcustica: janelaAcustica.trim(),
        achados: achados.trim(),
        imagemNome: imagemFile?.name || "",
      });

      await criarCaso({
        paciente_id: nomePaciente.trim(),
        indicacao: indicacaoCompleta,
        status,
      });

      toast.success("Caso criado com sucesso.", {
        description: "O novo caso POCUS foi salvo no Supabase.",
      });

      router.push("/historico");
    } catch (error) {
      toast.error("Erro ao salvar caso", {
        description: error instanceof Error ? error.message : "Erro inesperado ao criar caso.",
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Novo Caso
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Cadastrar Caso POCUS</h1>
            <p className="mt-2 text-sm text-slate-300">
              Formulário clínico para criação rápida de um novo caso.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Dados do Atendimento</h2>
            <p className="mt-2 text-sm text-slate-300">
              Preencha as informações essenciais do caso e salve no histórico.
            </p>
          </div>

          <form onSubmit={handleSalvar} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="nomePaciente" className="text-sm font-medium text-slate-200">
                  Nome do paciente
                </label>
                <input
                  id="nomePaciente"
                  value={nomePaciente}
                  onChange={(e) => setNomePaciente(e.target.value)}
                  placeholder="Ex.: Maria Silva"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                />
                {!validacoes.nomePaciente && nomePaciente.length > 0 && (
                  <p className="text-xs text-amber-300">Informe ao menos 3 caracteres.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="idade" className="text-sm font-medium text-slate-200">
                  Idade
                </label>
                <input
                  id="idade"
                  inputMode="numeric"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Ex.: 54"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                />
                {!validacoes.idade && idade.length > 0 && (
                  <p className="text-xs text-amber-300">Informe uma idade válida entre 0 e 120.</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="sexo" className="text-sm font-medium text-slate-200">
                  Sexo
                </label>
                <select
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Selecione o sexo</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
                {!validacoes.sexo && (
                  <p className="text-xs text-slate-400">Campo obrigatório.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="janelaAcustica" className="text-sm font-medium text-slate-200">
                  Janela acústica
                </label>
                <input
                  id="janelaAcustica"
                  value={janelaAcustica}
                  onChange={(e) => setJanelaAcustica(e.target.value)}
                  placeholder="Ex.: subxifoide, pulmonar, FAST"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
                {!validacoes.janelaAcustica && janelaAcustica.length > 0 && (
                  <p className="text-xs text-amber-300">Informe ao menos 3 caracteres.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="indicacaoClinica" className="text-sm font-medium text-slate-200">
                Indicação clínica
              </label>
              <textarea
                id="indicacaoClinica"
                value={indicacaoClinica}
                onChange={(e) => setIndicacaoClinica(e.target.value)}
                placeholder="Ex.: Dor abdominal aguda, suspeita de derrame pleural, FAST..."
                className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              />
              {!validacoes.indicacaoClinica && indicacaoClinica.length > 0 && (
                <p className="text-xs text-amber-300">Informe ao menos 5 caracteres.</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="achados" className="text-sm font-medium text-slate-200">
                Achados
              </label>
              <textarea
                id="achados"
                value={achados}
                onChange={(e) => setAchados(e.target.value)}
                placeholder="Descreva os principais achados ultrassonográficos observados."
                className="min-h-[140px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              />
              {!validacoes.achados && achados.length > 0 && (
                <p className="text-xs text-amber-300">Informe ao menos 3 caracteres.</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="imagem" className="text-sm font-medium text-slate-200">
                  Upload de imagem
                </label>

                <div className="rounded-2xl border border-dashed border-blue-500/30 bg-slate-950/80 p-4">
                  <label
                    htmlFor="imagem"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-8 text-center transition hover:border-blue-500/40 hover:bg-slate-800"
                  >
                    <Upload className="h-5 w-5 text-blue-300" />
                    <span className="text-sm font-medium text-slate-100">
                      {imagemFile ? imagemFile.name : "Clique para selecionar uma imagem"}
                    </span>
                    <span className="text-xs text-slate-400">
                      JPG, PNG ou WEBP para registro do caso
                    </span>
                  </label>

                  <input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImagemFile(file);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-200">
                  Status inicial
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="novo">Novo</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                </select>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                  Nesta versão, os dados clínicos completos são consolidados no campo de indicação para manter compatibilidade com o schema atual.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={salvando || !formValido}
                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-amber-500 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Caso
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setNomePaciente("");
                  setIdade("");
                  setSexo("");
                  setIndicacaoClinica("");
                  setJanelaAcustica("");
                  setAchados("");
                  setImagemFile(null);
                  setStatus("novo");
                }}
                className="inline-flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
