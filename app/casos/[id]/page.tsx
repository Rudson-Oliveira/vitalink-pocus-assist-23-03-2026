"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DisclaimerMedico } from "@/components/shared/disclaimer-medico";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImagePlus, Brain } from "lucide-react";

export default function CasoDetalhePage() {
  const params = useParams();
  const [caso, setCaso] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem(`caso_${params.id}`);
    if (data) setCaso(JSON.parse(data));
  }, [params.id]);

  if (!caso) return <p>Carregando...</p>;

  return (
    <div>
      <PageHeader title={caso.titulo} description={`Paciente: ${caso.nomePaciente}`}>
        <Link href={`/casos/${caso.id}/frames`}><Button variant="outline"><ImagePlus className="h-4 w-4 mr-2" />Upload Frames</Button></Link>
        <Link href={`/casos/${caso.id}/analise`}><Button><Brain className="h-4 w-4 mr-2" />Analisar com IA</Button></Link>
      </PageHeader>
      <DisclaimerMedico />
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card><CardHeader><CardTitle>Dados Clinicos</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Queixa:</strong> {caso.queixa}</p>
            <p><strong>Contexto:</strong> {caso.contexto}</p>
            <p><strong>Orgao:</strong> {caso.orgao}</p>
            <p><strong>Hipotese:</strong> {caso.hipotese || "Nenhuma"}</p>
            <p><strong>Limitacoes:</strong> {caso.limitacoes}</p>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Idade:</strong> {caso.idade || "N/I"}</p>
            <p><strong>Sexo:</strong> {caso.sexo}</p>
            <p><strong>Status:</strong> <Badge>{caso.status}</Badge></p>
            <p><strong>Criado:</strong> {new Date(caso.created_at).toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
