import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Zap, User, ShieldCheck, ChevronRight } from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Spinner } from "./Common";

export default function LoginScreen({ onLogin }) {
  const [role, setRole]       = useState("client");
  const [sel, setSel]         = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "clients"))
      .then(snap => setTenants(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch((e) => {
        console.error("Firebase error:", e);
        setErr("Erreur Firebase : " + (e.code || e.message));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    setErr("");
    if (role === "admin") {
      if (pass !== "elecpay1234") { setErr("Mot de passe incorrect."); return; }
      onLogin({ role: "admin" });
    } else {
      const t = tenants.find(x => x.id === sel);
      if (!t) { setErr("Veuillez sélectionner un locataire."); return; }
      onLogin({ role: "client", tenant: t });
    }
  };

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard} className="fade-in">
        <div style={S.loginIconWrap}><Zap size={32} color="#6366f1" fill="#6366f1" fillOpacity={0.2} /></div>
        <h1 style={S.loginTitle}>ElecPay</h1>
        <p style={S.loginSub}>Gestion des paiements d'électricité</p>

        <div style={S.roleToggle}>
          {[
            { key:"client", Icon: User,        label:"Locataire" },
            { key:"admin",  Icon: ShieldCheck, label:"Admin" },
          ].map(({ key, Icon, label }) => (
            <button key={key} onClick={() => { setRole(key); setErr(""); }}
              style={{ ...S.roleBtn, ...(role===key ? S.roleBtnActive : {}) }}>
              <Icon size={16} strokeWidth={2}/> {label}
            </button>
          ))}
        </div>

        <div style={{ textAlign:'left', marginBottom:8 }}>
          <label style={{ fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginLeft:4 }}>
            {role === "client" ? "Votre identité" : "Code d'accès"}
          </label>
        </div>

        {role === "client" ? (
          loading ? <Spinner/> : (
            <select value={sel} onChange={e => setSel(e.target.value)} style={S.input}>
              <option value="">— Sélectionner votre nom —</option>
              {tenants.sort((a,b) => a.nom.localeCompare(b.nom)).map(t => (
                <option key={t.id} value={t.id}>{t.nom} ({t.logement})</option>
              ))}
            </select>
          )
        ) : (
          <input type="password" placeholder="••••••••"
            value={pass} onChange={e => setPass(e.target.value)}
            style={S.input} onKeyDown={e => e.key==="Enter" && handleLogin()}/>
        )}

        {err && <p style={S.errMsg}>{err}</p>}

        <button onClick={handleLogin} style={S.loginBtn}>
          Se connecter <ChevronRight size={18} style={{ marginLeft:4 }}/>
        </button>
        
        {role === "admin" && (
          <div style={{ marginTop:24, padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>

          </div>
        )}
      </div>
    </div>
  );
}
