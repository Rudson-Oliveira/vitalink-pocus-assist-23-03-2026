"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Upload, DatabaseBackup, AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { exportarBackupCompleto, restaurarBackupCompleto } from "@/lib/pocus-db";
import type { BackupPayload } from "@/types/pocus";

function gerarNomeArquivoBackup() {
  const agora = new Date();
  const yyyy = agora.getFullYear();
  const mm = String(agora.getMonth() + 1).padStart(2, "0");
  const dd = String(agora.getDate()).padStart(2, "0");
  const hh = String(agora.getHours()).padStart(2, "0");
  const mi = String(agora.getMinutes()).padStart(2, "0");
  const ss = String(agora.getSeconds()).padStart(2, "0");

  return `vitalink-pocus-backup-${yyyy}${mm}${dd}-${hh}${mi}${ss}.json`;
}

function validarBackupBasico(payload: unknown): payload is BackupPayload {
  if (!payload || typeof payload !== "object") return false;

  const data = payload as BackupPayload;

  return (
    typeof data.version === "string" &&
    typeof data.generated_at === "string" &&
    Array.isArray(data.casos) &&
    Array.isArray(data.frames) &&
    Array.isArray(data.analises)
  );
}

export default function BackupPage() {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [exportando, setExportando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [backupPreview, setBackupPreview] = useState<BackupPayload | null>(null);
  const [arquivoNome, setArquivoNome] = useState("");
  const [arquivoTamanho, setArquivoTamanho] = useState(0);

  const resumoPreview = useMemo(() => {
    if (!backupPreview) {
      return { casos: 0, frames: 0, analises: 0 };
    }

    return {
      casos: backupPreview.casos.length,
      frames: backupPreview.frames.length,
      analises: backupPreview.analises.length,
    };
  }, [backupPreview]);

  async function handleExportarBackup() {
    try {
      setExportando(true);

      const payload = await exportarBackupCompleto();
      const nomeArquivo = gerarNomeArquivoBackup();

      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = nomeArquivo;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);

      toast.success("Backup exportado com sucesso.", {
        description: `${nomeArquivo} foi gerado para download.`,
      });
    } catch (e) {
      toast.error("Falha ao exportar backup", {
        description: e instanceof Error ? e.message : "Erro inesperado",
      });
    } finally {
      setExportando(false);
    }
  }

  async function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setBackupPreview(null);
      setArquivoNome("");
      setArquivoTamanho(0);
      return;
    }

    try {
      const texto = await file.text();
      const payload = JSON.parse(texto) as unknown;

      if (!validarBackupBasico(payload)) {
        throw new Error("Estrutura JSON inválida para backup do VITALINK POCUS ASSIST.");
      }

      setBackupPreview(payload);
      setArquivoNome(file.name);
      setArquivoTamanho(file.size);

      toast.success("Arquivo de backup carregado.", {
        description: "Pré-visualização pronta para restauração.",
      });
    } catch (e) {
      setBackupPreview(null);
      setArquivoNome(file.name);
      setArquivoTamanho(file.size);

      toast.error("Arquivo inválido", {
        description: e instanceof Error ? e.message : "Não foi possível interpretar o JSON.",
      });
    }
  }

  async function handleRestaurarBackup() {
    if (!backupPreview) {
      toast.error("Nenhum backup carregado para restauração.");
      return;
    }

    const confirmar = window.confirm(
      "ATENÇÃO: esta ação apagará todos os dados atuais do Supabase e restaurará os dados do arquivo JSON selecionado. Deseja continuar?"
    );

    if (!confirmar) return;

    const confirmar2 = window.confirm(
      "Confirma novamente a restauração completa? Esta ação não pode ser desfeita pelo sistema atual."
    );

    if (!confirmar2) return;

    try {
      setImportando(true);

      await restaurarBackupCompleto(backupPreview);

      toast.success("Restauração concluída com sucesso.", {
        description: "Os dados do backup foram reimportados para o Supabase.",
      });

      setBackupPreview(null);
      setArquivoNome("");
      setArquivoTamanho(0);

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } catch (e) {
      toast.error("Falha ao restaurar backup", {
        description: e instanceof Error ? e.message : "Erro inesperado",
      });
    } finally {
      setImportando(false);
    }
  }

  function handleLimparArquivo() {
    setBackupPreview(null);
    setArquivoNome("");
    setArquivoTamanho(0);

    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }

    toast.success("Arquivo de backup removido da pré-visualização.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Backup e Restauração
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Gerenciamento de Backup</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Exporte todos os dados do Supabase em JSON e restaure manualmente quando necessário.
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

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-600/20 p-3 text-amber-300 ring-1 ring-amber-500/20">
                <DatabaseBackup className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-50">Exportar backup completo</h2>
                <p className="mt-2 text-sm text-slate-300">
                  O sistema exporta todos os registros das tabelas casos, frames e analises.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm leading-6 text-slate-300">O arquivo baixado conterá:</p>

              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>• versão do backup</li>
                <li>• timestamp de geração</li>
                <li>• lista completa de casos</li>
                <li>• lista completa de frames</li>
                <li>• lista completa de análises</li>
              </ul>

              <div className="mt-5">
                <button
                  onClick={handleExportarBackup}
                  disabled={exportando}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {exportando ? "Exportando..." : "Baixar Backup JSON"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-2xl bg-red-500/10 p-3 text-red-300 ring-1 ring-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-50">Restaurar backup</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Esta operação apaga os dados atuais e reimporta o conteúdo do arquivo selecionado.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="backup_file" className="text-sm font-medium text-slate-200">
                  Selecionar arquivo JSON
                </label>

                <input
                  id="backup_file"
                  ref={inputFileRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleSelecionarArquivo}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
                />
              </div>

              {arquivoNome ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm font-semibold text-slate-100">Arquivo carregado</p>
                  <p className="mt-2 break-all text-sm text-slate-300">{arquivoNome}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Tamanho: {(arquivoTamanho / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400">
                  Nenhum arquivo selecionado.
                </div>
              )}

              {backupPreview && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-sm font-semibold text-blue-200">Pré-visualização do backup</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Casos</p>
                      <p className="mt-2 text-2xl font-bold text-slate-50">{resumoPreview.casos}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Frames</p>
                      <p className="mt-2 text-2xl font-bold text-slate-50">{resumoPreview.frames}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Análises</p>
                      <p className="mt-2 text-2xl font-bold text-slate-50">{resumoPreview.analises}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-300">
                    <p>
                      <span className="font-medium text-slate-100">Versão:</span> {backupPreview.version}
                    </p>
                    <p>
                      <span className="font-medium text-slate-100">Gerado em:</span>{" "}
                      {new Date(backupPreview.generated_at).toLocaleString("pt-BR")}
                    </p>
                    <p>
                      <span className="font-medium text-slate-100">Fonte:</span> {backupPreview.source}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRestaurarBackup}
                  disabled={!backupPreview || importando}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  {importando ? "Restaurando..." : "Restaurar Backup"}
                </button>

                <button
                  type="button"
                  onClick={handleLimparArquivo}
                  disabled={!backupPreview && !arquivoNome}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpar seleção
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-amber-100">Atenção operacional</h2>
              <div className="mt-3 space-y-2 text-sm leading-6 text-amber-50/90">
                <p>• A restauração substitui completamente os dados atuais.</p>
                <p>• Faça um backup novo antes de restaurar um backup antigo.</p>
                <p>• Este modelo atual não faz merge inteligente nem versionamento transacional de conflito.</p>
                <p>• Em produção real com dados sensíveis, o ideal é adicionar autenticação, trilha de auditoria e rotina automática de backup.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
