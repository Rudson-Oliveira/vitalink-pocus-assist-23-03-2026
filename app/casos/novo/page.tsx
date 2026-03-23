"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DisclaimerMedico } from "@/components/shared/disclaimer-medico";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORGAOS_ALVO } from "@/lib/constants";
import { Save } from "lucide-react";

export default function NovoCasoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomePaciente: "", idade: "", sexo: "nao informado",
    titulo: "", queixa: "", contexto: "", orgao: "",
    limitacoes: "", hipotese: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    localStorage.setItem(`caso_${id}`, JSON.stringify({ ...form, id, status: "rascunho", created_at: new Date().toISOString() }));
    router.push(`/casos/${id}`);
  };

  return (
    <div>
      <PageHeader title="Novo Caso" description="Registrar novo caso de triagem" />
      <DisclaimerMedico />
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>Dados do Paciente</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div><Label>Nome</Label><Input value={form.nomePaciente} onChange={(e) => setForm({...form, nomePaciente: e.target.value})} required /></div>
            <div><Label>Idade</Label><Input type="number" value={form.idade} onChange={(e) => setForm({...form, idade: e.target.value})} /></div>
            <div><Label>Sexo</Label>
              <Select value={form.sexo} onValueChange={(v) => setForm({...form, sexo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="nao informado">Nao informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Dados Clinicos</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label>Titulo do Caso</Label><Input value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} required /></div>
            <div><Label>Queixa Principal</Label><Textarea value={form.queixa} onChange={(e) => setForm({...form, queixa: e.target.value})} required /></div>
            <div><Label>Contexto Clinico</Label><Textarea value={form.contexto} onChange={(e) => setForm({...form, contexto: e.target.value})} required /></div>
            <div><Label>Orgao Alvo</Label>
              <Select value={form.orgao} onValueChange={(v) => setForm({...form, orgao: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{ORGAOS_ALVO.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Limitacoes do Exame (obrigatorio)</Label><Textarea value={form.limitacoes} onChange={(e) => setForm({...form, limitacoes: e.target.value})} required placeholder="Ex: sem Doppler, apenas convexo 3.5MHz..." /></div>
            <div><Label>Hipotese Clinica (opcional)</Label><Input value={form.hipotese} onChange={(e) => setForm({...form, hipotese: e.target.value})} /></div>
          </CardContent>
        </Card>
        <Button type="submit" size="lg"><Save className="h-4 w-4 mr-2" />Salvar Caso</Button>
      </form>
    </div>
  );
}
