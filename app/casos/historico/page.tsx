"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FolderPlus } from "lucide-react";

export default function HistoricoPage() {
  const [casos, setCasos] = useState<any[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("caso_"));
    const data = keys.map((k) => JSON.parse(localStorage.getItem(k)!)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setCasos(data);
  }, []);

  return (
    <div>
      <PageHeader title="Historico de Casos" description="Todos os casos registrados">
        <Link href="/casos/novo"><Button><FolderPlus className="h-4 w-4 mr-2" />Novo Caso</Button></Link>
      </PageHeader>
      {casos.length === 0 ? (
        <EmptyState title="Nenhum caso ainda" description="Crie seu primeiro caso de triagem.">
          <Link href="/casos/novo"><Button>Criar Caso</Button></Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {casos.map((c) => (
            <Link key={c.id} href={`/casos/${c.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-3">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{c.titulo || "Sem titulo"}</p>
                    <p className="text-sm text-muted-foreground">{c.nomePaciente} - {c.orgao}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{c.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
