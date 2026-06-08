import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export const Badge = ({ statut }) => {
  const cfg = {
    "payé":     { bg:"#e6f6ff", color:"#0070f3", border:"#b3e0ff", Icon: CheckCircle,   label:"Payé" },   
    "non payé": { bg:"#fff0f0", color:"#ee0000", border:"#ffd1d1", Icon: XCircle,       label:"Non payé" },
    "retard":   { bg:"#fffbeb", color:"#f5a623", border:"#fef3c7", Icon: AlertTriangle, label:"Retard" },   
  }[statut] || { bg:"#fafafa", color:"#666", border:"#eaeaea", Icon: XCircle, label: statut };
  const { bg, color, border, Icon, label } = cfg;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:bg, color, border:`1px solid ${border}`,
      padding:"2px 10px", borderRadius:99, fontSize:12, fontWeight:500,
      whiteSpace:"nowrap"
    }}>
      <Icon size={12} strokeWidth={2}/> {label}
    </span>
  );
};

export const Spinner = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:60 }}>
    <Loader2 size={32} color="#000" style={{ animation:"spin 1s linear infinite" }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
