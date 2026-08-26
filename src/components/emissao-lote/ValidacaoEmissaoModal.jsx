import React, { useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";

const rcfvLmiEfetivo = (row, filial, rcfvLmiSelecionado) => {
  if (row.rcfv_lmi && filial?.rcfv_lmis_permitidos?.length && filial.rcfv_lmis_permitidos.includes(row.rcfv_lmi)) {
    return row.rcfv_lmi;
  }
  return rcfvLmiSelecionado;
};

export default function ValidacaoEmissaoModal({
  open, onClose, onConfirm,
  linhas, filial, rcfvLmi,
  totalNovas, totalRenovacoes, totalDuplicatas,
}) {
  const problemas = useMemo(() => {
    const lista = [];
    linhas.forEach((row) => {
      const issues = [];
      const alertas = [...(row._alertas || [])];

      if (row._tipo !== "duplicata") {
        if (!row.placa) issues.push("Placa ausente");
        if (row.premio_bruto <= 0) issues.push("Prêmio bruto inválido (R$ 0,00)");
        if (!row.data_inicio) issues.push("Data de início inválida");
        if (row.rcfv_lmi && filial?.rcfv_lmis_permitidos?.length && !filial.rcfv_lmis_permitidos.includes(row.rcfv_lmi)) {
          issues.push(`LMI RCF-V R$ ${row.rcfv_lmi.toLocaleString("pt-BR")} não permitido para esta filial — será usado o LMI padrão`);
        }
      }

      if (issues.length > 0 || alertas.length > 0) {
        lista.push({
          row: row._row,
          cpf: row.cpf_segurado,
          placa: row._placa_norm || row.placa,
          tipo: row._tipo,
          issues,
          alertas,
        });
      }
    });
    return lista;
  }, [linhas, filial]);

  const totalProblemas = problemas.length;
  const aptasEmissao = totalNovas + totalRenovacoes;
  const lmisPermitidos = filial?.rcfv_lmis_permitidos || [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            Validação e Verificação da Emissão
          </DialogTitle>
        </DialogHeader>

        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 p-3 text-center">
            <p className="text-2xl font-bold text-slate-800">{linhas.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{totalNovas}</p>
            <p className="text-xs text-slate-500">Novas</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center">
            <p className="text-2xl font-bold text-purple-700">{totalRenovacoes}</p>
            <p className="text-xs text-slate-500">Renovações</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{totalDuplicatas}</p>
            <p className="text-xs text-slate-500">Duplicatas</p>
          </div>
        </div>

        {/* Filial + LMI */}
        <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
          <p className="text-sm">
            <span className="font-semibold text-slate-700">Filial emissora:</span>{" "}
            <span className="text-slate-900">{filial?.nome || "—"}</span>
            {" — Código "}<span className="font-mono">{filial?.codigo_filial || "—"}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold text-slate-700">LMI RCF-V selecionado:</span>{" "}
            <span className="font-semibold text-blue-700">R$ {rcfvLmi.toLocaleString("pt-BR")}</span>
          </p>
          <p className="text-xs text-slate-500">
            LMIs permitidos para esta filial:{" "}
            {lmisPermitidos.length > 0
              ? lmisPermitidos.map((v) => `R$ ${v.toLocaleString("pt-BR")}`).join(", ")
              : "nenhum cadastrado"}
          </p>
        </div>

        {/* Problemas / Tudo certo */}
        {totalProblemas === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Tudo certo! Nenhum problema detectado.</p>
              <p className="text-sm text-green-700">
                {aptasEmissao} apólice(s) pronta(s) para emissão. Duplicatas serão ignoradas automaticamente.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="font-semibold text-amber-800">
                {totalProblemas} linha(s) com observações
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="text-left">
                      <th className="px-2 py-1.5 font-semibold text-slate-600 w-10">#</th>
                      <th className="px-2 py-1.5 font-semibold text-slate-600">CPF Segurado</th>
                      <th className="px-2 py-1.5 font-semibold text-slate-600">Placa</th>
                      <th className="px-2 py-1.5 font-semibold text-slate-600">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problemas.map((p, pi) => (
                      <tr key={pi} className="border-t bg-amber-50/40">
                        <td className="px-2 py-1.5 text-slate-400">{p.row}</td>
                        <td className="px-2 py-1.5 font-mono">{p.cpf}</td>
                        <td className="px-2 py-1.5 font-mono">
                          {p.placa || <span className="text-red-400 italic">ausente</span>}
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex flex-col gap-0.5">
                            {p.issues.map((iss, ii) => (
                              <span key={`i${ii}`} className="text-red-600 flex items-start gap-1">
                                <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{iss}
                              </span>
                            ))}
                            {p.alertas.map((a, ai) => (
                              <span key={`a${ai}`} className="text-amber-600 flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />{a}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Linhas com erros serão marcadas como falha durante a emissão. Duplicatas serão ignoradas automaticamente.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={onConfirm}
            disabled={!filial || aptasEmissao === 0}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar e Emitir {aptasEmissao} Apólice(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}