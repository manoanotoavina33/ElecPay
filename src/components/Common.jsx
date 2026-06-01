import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export const Badge = ({ statut }) => {
  const cfg = {
    "payé":     { bg:"#0d9f6e18", color:"#0d9f6e", border:"#0d9f6e33", Icon: CheckCircle,   label:"Payé" },   
    "non payé": { bg:"#ef444418", color:"#ef4444", border:"#ef444433", Icon: XCircle,       label:"Non payé" },
    "retard":   { bg:"#f9731618", color:"#f97316", border:"#f9731633", Icon: AlertTriangle, label:"Retard" },   
  }[statut] || { bg:"#6b728018", color:"#6b7280", border:"#6b728033", Icon: XCircle, label: statut };
  const { bg, color, border, Icon, label } = cfg;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:bg, color, border:`1px solid ${border}`,
      padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700,
      letterSpacing:.3, whiteSpace:"nowrap"
    }}>
      <Icon size={11} strokeWidth={2.5}/> {label}
    </span>
  );
};

export const Spinner = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:60 }}>
    <Loader2 size={32} color="#6366f1" style={{ animation:"spin 1s linear infinite" }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
