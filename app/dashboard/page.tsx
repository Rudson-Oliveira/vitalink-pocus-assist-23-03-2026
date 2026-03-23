import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DisclaimerMedico } from "@/components/shared/disclaimer-medico";
import { Button } from "@/components/ui/button";
import { FolderPlus, FileImage, Brain, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Visao geral do VITALINK POCUS ASSIST">
        <Link href="/casos/novo">
          <Button><FolderPlus className="h-4 w-4 mr-2" />Novo Caso</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Total de Casos" value={0} icon={ClipboardList} description="casos registrados" />
        <StatCard title="Frames Capturados" value={0} icon={FileImage} description="imagens salvas" />
        <StatCard title="Analises IA" value={0} icon={Brain} description="pre-analises realizadas" />
        <StatCard title="Em Andamento" value={0} icon={FolderPlus} description="casos abertos" />
      </div>

      <DisclaimerMedico />
    </div>
  );
}
