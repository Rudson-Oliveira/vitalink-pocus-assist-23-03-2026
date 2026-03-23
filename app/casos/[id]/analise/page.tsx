"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DisclaimerMedico } from "@/components/shared/disclaimer-medico";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2 } from "lucide-react";

export default function AnalisePage() {
  const params = useParams();
  const [caso, setCaso] = useState<any>(null);
  const [frames, setFrames] = useState<any[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<number>(0);
  const [analise, setAnalise] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`caso_${params.id}`);
    if (data) setCaso(JSON.parse(data));
    const fkeys = Object.keys(localStorage).filter((k) => k.startsWith(`frame_${params.id}_`));
    setFrames(fkeys.map((k) => JSON.parse(localStorage.getItem(k)!)));
  }, [params.id]);

  const analisar = async () => {
    if (!caso || frames.length === 0) return;
    setLoading(true);
    try {
      const frame = frames[selectedFrame];
      const base64 = frame.data.split(",")[1];
      const res = await fetch("/api/analise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          orgao: caso.orgao,
          queixa: caso.queixa,
          contextoClinico: caso.contexto,
          hipotese: caso.hipotese,
          limitacoes: caso.limitacoes,
        }),
      });
      const data = await res.json();
      setAnalise(data);
    } catch (err: any) {
      setAnalise({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Analise Assistida por IA" description="Pre-analise educacional do frame" />
      <DisclaimerMedico />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Frames Disponiveis</CardTitle></CardHeader>
          <CardContent>
            {frames.length === 0 ? (
              <p className="text-muted-foreground">Nenhum frame. Faca upload primeiro.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {frames.map((f, i) => (
                    <img key={i} src={f.data} alt={f.name}
                      className={`rounded border cursor-pointer object-cover aspect-square ${selectedFrame === i ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedFrame(i)} />
                  ))}
                </div>
                <Button onClick={analisar} disabled={loading} className="w-full">
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analisando...</> : <><Brain className="h-4 w-4 mr-2" />Analisar Frame {selectedFrame + 1}</>}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resultado da Analise</CardTitle></CardHeader>
          <CardContent>
            {!analise ? (
              <p className="text-muted-foreground">Selecione um frame e clique em analisar.</p>
            ) : analise.error ? (
              <p className="text-red-400">Erro: {analise.error}</p>
            ) : (
              <div className="space-y-4 text-sm">
                <div><strong>Estruturas Visiveis:</strong><p className="mt-1">{analise.estruturas_visiveis}</p></div>
                <div><strong>Qualidade Tecnica:</strong><p className="mt-1">{analise.qualidade_tecnica}</p><Badge className="mt-1">Score: {analise.score_qualidade}/5</Badge></div>
                <div><strong>Achados Possiveis:</strong><p className="mt-1">{analise.achados_possiveis}</p></div>
                <div><strong>Diferenciais:</strong><p className="mt-1">{analise.diferenciais}</p></div>
                <div><strong>O que Falta Avaliar:</strong><p className="mt-1">{analise.o_que_falta}</p></div>
                <div><strong>Ajustes Tecnicos:</strong><p className="mt-1">{analise.ajustes_tecnicos}</p></div>
                <div><strong>Grau de Confianca:</strong> <Badge variant="outline">{analise.grau_confianca}</Badge></div>
                <div className="border-t pt-3 mt-3"><p className="text-xs text-yellow-400">{analise.disclaimer}</p></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
