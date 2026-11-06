import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

// O modelo segue exatamente a ordem de colunas lida pela Emissão em Lote.
const CABECALHO = [
  "filial",
  "CPF segurado",
  "CPF beneficiario",
  "Placa",
  "data inicio apolice",
  "data do movimento",
  "valor lmi",
  "premio bruto",
  "LMI RCF-V (opcional)",
];

const LINHAS_EXEMPLO = [
  ["Mont Seguros", "123.456.789-00", "123.456.789-00", "ABC1D23", "01/12/2026", "01/12/2026", "100.000,00", "450,00", "30000"],
  ["Mont Seguros", "987.654.321-00", "987.654.321-00", "XYZ9K88", "01/12/2026", "01/12/2026", "100.000,00", "450,00", ""],
];

const COLUNAS = [
  "Filial (nome exato cadastrado)",
  "CPF ou CNPJ do segurado",
  "CPF ou CNPJ do beneficiário",
  "Placa do veículo",
  "Início da apólice (dd/mm/aaaa)",
  "Data do movimento (dd/mm/aaaa)",
  "Valor do LMI geral (R$)",
  "Prêmio bruto (R$)",
  "LMI RCF-V (30/50/70/100 mil — opcional)",
];

export default function ModeloPlanilha() {
  const baixarModelo = () => {
    const csv = [CABECALHO, ...LINHAS_EXEMPLO].map((linha) => linha.join(";")).join("\r\n");
    // BOM para o Excel abrir os acentos corretamente
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "modelo-emissao-em-lote.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Modelo de planilha</p>
            <p className="text-xs text-slate-500">
              Baixe o modelo, preencha uma linha por apólice e salve como CSV antes de enviar.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={baixarModelo} className="gap-2 bg-white">
          <Download className="w-4 h-4" />
          Baixar modelo CSV
        </Button>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-1 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
        {COLUNAS.map((coluna, index) => (
          <p key={coluna}>
            <span className="font-semibold text-slate-700">{index + 1}.</span> {coluna}
          </p>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Na coluna LMI RCF-V pode escrever 30 mil, 50 mil, 70 mil, 100 mil ou o valor completo (ex: 70.000,00) — o sistema identifica automaticamente. Em branco, vale o LMI selecionado acima. Mantenha a primeira linha (cabeçalho).
      </p>
    </div>
  );
}