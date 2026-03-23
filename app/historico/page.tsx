"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { excluirCaso, listarCasos } from "@/lib/pocus-db";
import type { Caso } from "@/types/pocus";

function badgeClasse(status: string) {
  if (status === "concluido") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "em_andamento") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-blue-500/20 bg-blue-500/10 text-blue-300";
}

export default function HistoricoPage() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function carregarCasos() {
    try {
      setLoading(true);
      const data = await listarCasos();
      setCasos(data);
    } catch (error) {
      toast.error("Erro ao carregar histórico", {
        description: error instanceof Error ? error.message : "Erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCasos();
  }, []);

  async function handleExcluir(id: string) {
    const confirmar = window.confirm("Deseja realmente excluir este caso?");
    if (!confirmar) return;

    try {
      setDeletingId(id);
      await excluirCaso(id);
      toast.success("Caso excluído com sucesso.");
      await carregarCasos();
    } catch (error) {
      toast.error("Erro ao excluir caso", {
        description: error instanceof Error ? error.message : "Erro inesperado.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const casosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return casos.filter((caso) => {
      const combinaBusca =
        termo.length === 0 ||
        caso.paciente_id.toLowerCase().includes(termo) ||
        (caso.indicacao || "").toLowerCase().includes(termo) ||
        caso.status.toLowerCase().includes(termo) ||
        caso.id.toLowerCase().includes(termo);

      const combinaStatus = statusFiltro === "todos" || caso.status === statusFiltro;

      return combinaBusca && combinaStatus;
    });
  }, [casos, busca, statusFiltro]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
              Histórico
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Casos Salvos</h1>
            <p className="mt-2 text-sm text-slate-300">
              Consulte, filtre e gerencie os casos POCUS armazenados.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>

            <button
              onClick={carregarCasos}
              className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <p className="mt-1 text-sm text-slate-300">
              Pesquise por paciente, indicação, status ou ID do caso.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.5fr_0.7fr]">
            <div className="space-y-2">
              <label htmlFor="busca" className="text-sm font-medium text-slate-200">
                Busca
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
                <input
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar paciente, indicação, status ou ID..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="statusFiltro" className="text-sm font-medium text-slate-200">
                Filtro por status
              </label>
              <select
                id="statusFiltro"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="todos">Todos</option>
                <option value="novo">Novo</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Tabela de Casos</h2>
            <p className="mt-1 text-sm text-slate-300">
              {loading ? "Carregando dados..." : `${casosFiltrados.length} caso(s) encontrado(s)`}
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-10 text-center text-sm text-slate-300">
              Carregando histórico...
            </div>
          ) : casosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-10 text-center text-sm text-slate-300">
              Nenhum caso encontrado para os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Paciente</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Indicação</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Criado em</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {casosFiltrados.map((caso) => (
                    <tr key={caso.id} className="hover:bg-slate-950/70">
                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-50">{caso.paciente_id}</p>
                          <p className="max-w-[220px] truncate text-xs text-slate-400">{caso.id}</p>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="max-w-[380px] text-sm text-slate-200 line-clamp-2">
                          {caso.indicacao || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasse(caso.status)}`}>
                          {caso.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-300">
                        {new Date(caso.created_at).toLocaleString("pt-BR")}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/casos/${caso.id}`}
                            className="inline-flex items-center rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/20"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Link>

                          <Link
                            href={`/casos/${caso.id}`}
                            className="inline-flex items-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>

                          <button
                            onClick={() => handleExcluir(caso.id)}
                            disabled={deletingId === caso.id}
                            className="inline-flex items-center rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === caso.id ? "Excluindo..." : "Excluir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
