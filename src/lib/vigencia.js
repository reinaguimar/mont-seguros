import { addDays, format } from "date-fns";

export const PRAZO_EM_DIAS = 30;

// Cálculo do fim da vigência à prova de fuso horário.
// Analisa YYYY-MM-DD como meio-dia no horário local (evita o deslocamento
// da meia-noite UTC), adiciona os dias de vigência e devolve YYYY-MM-DD.
export function calcularFimVigencia(dataInicioISO, prazoDias = PRAZO_EM_DIAS) {
  if (!dataInicioISO) return "";
  const inicio = new Date(`${dataInicioISO}T12:00:00`);
  const fim = addDays(inicio, prazoDias);
  return format(fim, "yyyy-MM-dd");
}