"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

export default function FramesPage() {
  const params = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).slice(0, 5);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const salvar = () => {
    files.forEach((f, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        const key = `frame_${params.id}_${i}`;
        localStorage.setItem(key, JSON.stringify({ name: f.name, data: reader.result, ordem: i + 1 }));
      };
      reader.readAsDataURL(f);
    });
    alert("Frames salvos! Volte ao caso para analisar.");
  };

  return (
    <div>
      <PageHeader title="Upload de Frames" description="Envie 1 a 5 imagens do ultrassom" />
      <Card>
        <CardContent className="p-6">
          <Input type="file" accept="image/*" multiple onChange={handleFiles} />
          <p className="text-sm text-muted-foreground mt-2">{files.length}/5 imagens selecionadas</p>
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {previews.map((p, i) => <img key={i} src={p} alt={`Frame ${i+1}`} className="rounded-lg border object-cover aspect-square" />)}
            </div>
          )}
          {files.length > 0 && <Button onClick={salvar} className="mt-4"><Upload className="h-4 w-4 mr-2" />Salvar Frames</Button>}
        </CardContent>
      </Card>
    </div>
  );
}
