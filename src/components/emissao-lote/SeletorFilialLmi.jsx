import React from "react";
import { Building2 } from "lucide-react";

export default function SeletorFilialLmi({
  filiais, filialSelecionada, setFilialSelecionada,
  rcfvLmiSelecionado, setRcfvLmiSelecionado,
}) {
  return (
    <div className="border-2 border-amber-400 bg-amber-50 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <Building2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-amber-900 mb-3">Selecione a Filial Emissora e o LMI RCF-V</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {filiais.map(f => (
              <button
                key={f.id}
                onClick={() => setFilialSelecionada(f)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  filialSelecionada?.id === f.id
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
                }`}
              >
                {f.nome} — Código {f.codigo_filial || "—"}
              </button>
            ))}
          </div>
          {filialSelecionada?.rcfv_lmis_permitidos?.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1.5">LMI RCF-V (Limite Máximo Indenização)</label>
              <div className="flex flex-wrap gap-2">
                {filialSelecionada.rcfv_lmis_permitidos.map(v => (
                  <button
                    key={v}
                    onClick={() => setRcfvLmiSelecionado(v)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                      rcfvLmiSelecionado === v
                        ? "border-blue-600 bg-blue-600 text-white shadow-md"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
                    }`}
                  >
                    R$ {v.toLocaleString("pt-BR")}
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-700 mt-1.5">
                O LMI RCF-V será aplicado a todas as apólices. Se o CSV informar um LMI RCF-V na coluna 9 (após o prêmio bruto), ele será usado por linha quando permitido para a filial.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}