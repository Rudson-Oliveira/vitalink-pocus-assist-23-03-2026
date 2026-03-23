"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  DatabaseBackup,
  FilePlus2,
  FolderOpen,
  History,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { obterDashboardMetricas } from "@/lib/pocus-db";
import type { DashboardMetricas } from "@/types/pocus";

const metricasIniciais: DashboardMetricas = {
  totalCasos: 0,
  totalFrames: 0,
  totalAnalises: 0,
  emAndamento: 0,
};

export default function DashboardPage() {
  const [metricas, setMetricas] = useState<DashboardMetricas>(metricasIniciais);
  const [loading, setLoading] = useState(true);

  async function carregarMetricas() {
    try {
      setLoading(true);
      const data = await obterDashboardMetricas();
      setMetricas(data);
    } catch (error) {
      toast.error("Erro ao carregar dashboard", {
        description: error instanceof Error ? error.message : "Erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMetricas();
  }, []);

  const cards = [
    {
      title: "Total de Casos",
      value: metricas.totalCasos,
      icon: FolderOpen,
      tone: "from-amber-500/20 to-amber-700/10 border-amber-500/20 text-amber-300",
    },
    {
      title: "Frames",
      value: metricas.totalFrames,
      icon: ImageIcon,
      tone: "from-blue-500/20 to-blue-700/10 border-blue-500/20 text-blue-300",
    },
    {
      title: "Análises",
      value: metricas.totalAnalises,
      icon: BrainCircuit,
      tone: "from-cyan-500/20 to-cyan-700/10 border-cyan-500/20 text-cyan-300",
    },
    {
      title: "Em Andamento",
      value: metricas.emAndamento,
      icon: Activity,
      tone: "from-violet-500/20 to-violet-700/10 border-violet-500/20 text-violet-300",
    },
  ];

  const atalhos = [
    {
      href: "/novo-caso",
      label: "Novo Caso",
      description: "Cadastrar novo atendimento POCUS",
      icon: FilePlus2,
      className: "border-amber-500/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20",
    },
    {
      href: "/historico",
      label: "Histórico",
      description: "Consultar casos salvos e filtrar registros",
      icon: History,
      className: "border-blue-500/20 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20",
    },
    {
      href: "/backup",
      label: "Backup",
      description: "Exportar e restaurar dados em JSON",
      icon: DatabaseBackup,
      className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 lg:flex-row">
      <AppSidebar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                Dashboard Clínico
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                VITALINK POCUS ASSIST
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Painel principal com métricas reais do Supabase e atalhos para operação do MVP.
              </p>
            </div>

            <button
              onClick={carregarMetricas}
              className="inline-flex items-center gap-2 self-start rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar dados
            </button>
          </header>

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`rounded-3xl border bg-gradient-to-br ${card.tone} p-5 shadow-lg shadow-slate-950/30`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{card.title}</p>
                      <div className="mt-3 text-3xl font-bold text-slate-50">
                        {loading ? "..." : card.value}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950/50 p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                Acesso Rápido
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                Módulos do sistema
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Navegue diretamente para as principais áreas operacionais.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {atalhos.map((atalho) => {
                const Icon = atalho.icon;

                return (
                  <Link
                    key={atalho.href}
                    href={atalho.href}
                    className={`rounded-3xl border p-5 transition ${atalho.className}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{atalho.label}</h3>
                        <p className="mt-2 text-sm text-slate-100/80">
                          {atalho.description}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-950/40 p-3">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                Resumo Operacional
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                Estado atual do MVP
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Persistência</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Os dados do sistema estão sendo lidos do Supabase, substituindo o mock anterior em localStorage.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Backup e recuperação</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O módulo de backup permite exportar casos, frames e análises em JSON e restaurar sob confirmação manual.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Cadastro de casos</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O formulário de novo caso já está separado em rota própria para evitar 404 e melhorar o fluxo clínico.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Histórico pesquisável</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O histórico agora possui busca, filtro por status e ações rápidas para visualizar, editar e excluir.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
