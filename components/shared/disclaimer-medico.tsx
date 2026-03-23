import { DISCLAIMER_MEDICO } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

export function DisclaimerMedico() {
  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-200/90 leading-6">{DISCLAIMER_MEDICO}</p>
      </div>
    </div>
  );
}
