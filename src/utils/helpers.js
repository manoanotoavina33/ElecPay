export const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const date = new Date();
export const CURRENT_MONTH = moisNoms[date.getMonth()] + " " + date.getFullYear();

export const getRecentMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = -12; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(moisNoms[d.getMonth()] + " " + d.getFullYear());
  }
  return months.reverse();
};

export const getMonthYear = (d) => {
  return moisNoms[d.getMonth()] + " " + d.getFullYear();
};

export const fmt = (n) => Number(n || 0).toLocaleString("fr-FR") + " Ar";

export const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const moisShort = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];    
  return `${d} ${moisShort[parseInt(m) - 1]}`;
};