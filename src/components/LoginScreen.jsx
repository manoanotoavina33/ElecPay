import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Zap, User, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Spinner } from "./Common";

/* ── Particule flottante ── */
function Particle({ style }) {
  return <div style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", ...style }} />;
}

/* ── Éclair décoratif SVG ── */
function ZapOrb({ size, top, left, opacity, delay }) {
  return (
    <div style={{
      position:"absolute", top, left, opacity,
      animation: `floatOrb 6s ease-in-out ${delay}s infinite`,
      pointerEvents:"none",
    }}>
      <Zap size={size} color="#6366f1" strokeWidth={1.5} />
    </div>
  );
}

export default function LoginScreen({ onLogin }) {
  const [role, setRole]       = useState("client");
  const [sel, setSel]         = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shake, setShake]     = useState(false);
  const [focused, setFocused] = useState(false);

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
      if (pass !== "elecpay1234") {
        setErr("Mot de passe incorrect.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }
      onLogin({ role: "admin" });
    } else {
      const t = tenants.find(x => x.id === sel);
      if (!t) {
        setErr("Veuillez sélectionner un locataire.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }
      onLogin({ role: "client", tenant: t });
    }
  };

  return (
    <div style={ls.wrap}>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(8deg); }
          66%       { transform: translateY(8px) rotate(-5deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.7; }
          50%  { transform: scale(1.08); opacity: 0.2; }
          100% { transform: scale(0.92); opacity: 0.7; }
        }
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(30px, -40px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(-25px, 30px); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(20px, 25px); }
        }
        @keyframes slideUp {
          from { opacity:0; transform: translateY(28px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .login-card-anim {
          animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .shake {
          animation: shake 0.5s ease both;
        }
        select option { background: #1e293b; color: #f1f5f9; }
      `}</style>

      {/* ── Fond animé ── */}
      <div style={ls.bg} />

      {/* ── Orbes flottants ── */}
      <div style={{ ...ls.orb, width:380, height:380, top:"-80px", left:"-80px", animationName:"drift1", animationDuration:"9s" }} />
      <div style={{ ...ls.orb, width:260, height:260, bottom:"40px", right:"-60px", background:"radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", animationName:"drift2", animationDuration:"11s" }} />
      <div style={{ ...ls.orb, width:180, height:180, top:"40%", right:"10%", background:"radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", animationName:"drift3", animationDuration:"7s" }} />

      {/* ── Éclairs décoratifs ── */}
      <ZapOrb size={22} top="12%"  left="8%"  opacity={0.18} delay={0}   />
      <ZapOrb size={14} top="70%"  left="6%"  opacity={0.12} delay={1.5} />
      <ZapOrb size={18} top="20%"  left="88%" opacity={0.15} delay={0.8} />
      <ZapOrb size={11} top="80%"  left="82%" opacity={0.12} delay={2.2} />
      <ZapOrb size={28} top="50%"  left="92%" opacity={0.08} delay={1}   />

      {/* ── Carte principale ── */}
      <div style={{ ...ls.card, animation: shake ? "shake 0.5s ease both" : "slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>

        {/* Logo animé */}
        <div style={ls.logoWrap}>
          {/* Anneau pulsant */}
          <div style={ls.pulseRing} />
          <div style={ls.logoIcon}>
            <Zap size={30} color="#fff" strokeWidth={2.5} fill="#fff" fillOpacity={0.15} />
          </div>
        </div>

        <h1 style={ls.title}>ElecPay</h1>
        <p style={ls.sub}>Gestion des paiements d'électricité</p>

        {/* Toggle rôle */}
        <div style={ls.roleToggle}>
          {[
            { key:"client", Icon: User,        label:"Locataire" },
            { key:"admin",  Icon: ShieldCheck, label:"Admin" },
          ].map(({ key, Icon, label }) => (
            <button key={key}
              onClick={() => { setRole(key); setErr(""); }}
              style={{ ...ls.roleBtn, ...(role===key ? ls.roleBtnActive : {}) }}>
              <Icon size={15} strokeWidth={2} />
              {label}
              {role === key && <div style={ls.roleDot} />}
            </button>
          ))}
        </div>

        {/* Label */}
        <div style={{ textAlign:"left", marginBottom:8 }}>
          <label style={ls.fieldLabel}>
            {role === "client" ? "Votre identité" : "Code d'accès"}
          </label>
        </div>

        {/* Input zone */}
        <div style={{ position:"relative" }}>
          {role === "admin" && (
            <Lock size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", zIndex:1, pointerEvents:"none" }} />
          )}

          {role === "client" ? (
            loading ? <Spinner /> : (
              <select value={sel} onChange={e => setSel(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{ ...ls.input, ...(focused ? ls.inputFocus : {}) }}>
                <option value="">— Sélectionner votre nom —</option>
                {tenants.sort((a,b) => a.nom.localeCompare(b.nom)).map(t => (
                  <option key={t.id} value={t.id}>{t.nom} ({t.logement})</option>
                ))}
              </select>
            )
          ) : (
            <input type="password" placeholder="••••••••"
              value={pass} onChange={e => setPass(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ ...ls.input, paddingLeft:42, ...(focused ? ls.inputFocus : {}) }}
              onKeyDown={e => e.key==="Enter" && handleLogin()} />
          )}
        </div>

        {/* Erreur */}
        {err && (
          <div style={ls.errBox}>
            <span style={{ fontSize:16 }}>⚠</span> {err}
          </div>
        )}

        {/* Bouton */}
        <button onClick={handleLogin} style={ls.btn}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          Se connecter
          <ChevronRight size={18} style={{ marginLeft:6 }} />
        </button>

        {/* Divider */}
        <div style={ls.divider}>
          <div style={ls.dividerLine} />
          <span style={ls.dividerText}>ElecPay v1.0</span>
          <div style={ls.dividerLine} />
        </div>

        {/* Footer note */}
        <p style={ls.footer}>
          Vos données sont sécurisées via Firebase
        </p>
      </div>
    </div>
  );
}

/* ── Styles ── */
const ls = {
  wrap: {
    minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Segoe UI', system-ui, sans-serif",
    position:"relative", overflow:"hidden",
    background:"#070d1a",
  },
  bg: {
    position:"absolute", inset:0, zIndex:0,
    background:"radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(6,182,212,0.07) 0%, transparent 50%)",
  },
  orb: {
    position:"absolute", borderRadius:"50%", zIndex:0,
    background:"radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
    animationTimingFunction:"ease-in-out", animationIterationCount:"infinite",
  },
  card: {
    position:"relative", zIndex:10,
    width:380, padding:"44px 40px 36px",
    borderRadius:24,
    background:"rgba(15,23,42,0.85)",
    backdropFilter:"blur(24px)",
    border:"1px solid rgba(255,255,255,0.08)",
    boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
    textAlign:"center", color:"#f1f5f9",
    transition:"transform 0.2s ease",
  },

  /* Logo */
  logoWrap: { position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:20, width:72, height:72 },
  pulseRing: {
    position:"absolute", inset:-6, borderRadius:"50%",
    border:"2px solid rgba(99,102,241,0.35)",
    animation:"pulse-ring 3s ease-in-out infinite",
  },
  logoIcon: {
    width:64, height:64, borderRadius:18,
    background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 8px 24px rgba(99,102,241,0.45)",
  },

  title: { margin:"0 0 6px", fontSize:30, fontWeight:900, letterSpacing:-1, color:"#f8fafc" },
  sub:   { margin:"0 0 28px", fontSize:13, color:"#64748b", letterSpacing:.2 },

  /* Toggle */
  roleToggle: {
    display:"flex", gap:6, marginBottom:28,
    background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:14, padding:5,
  },
  roleBtn: {
    flex:1, padding:"9px 0", borderRadius:10, border:"none",
    background:"transparent", color:"#64748b", cursor:"pointer",
    fontSize:13, fontWeight:600, display:"flex", alignItems:"center",
    justifyContent:"center", gap:7, transition:"all .2s", position:"relative",
  },
  roleBtnActive: {
    background:"rgba(99,102,241,0.18)",
    color:"#a5b4fc",
    boxShadow:"0 0 0 1px rgba(99,102,241,0.3)",
  },
  roleDot: {
    position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)",
    width:4, height:4, borderRadius:"50%", background:"#6366f1",
  },

  /* Champ */
  fieldLabel: { fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:.6, marginLeft:2 },
  input: {
    width:"100%", padding:"12px 14px", borderRadius:11,
    border:"1.5px solid rgba(255,255,255,0.08)",
    background:"rgba(255,255,255,0.05)",
    color:"#f1f5f9", fontSize:14,
    boxSizing:"border-box", outline:"none",
    transition:"border-color .2s, background .2s",
    marginBottom:4,
  },
  inputFocus: {
    borderColor:"rgba(99,102,241,0.6)",
    background:"rgba(99,102,241,0.06)",
    boxShadow:"0 0 0 3px rgba(99,102,241,0.12)",
  },

  /* Erreur */
  errBox: {
    display:"flex", alignItems:"center", gap:8,
    background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)",
    borderRadius:10, padding:"10px 14px",
    color:"#fca5a5", fontSize:13, fontWeight:500, marginTop:8, textAlign:"left",
  },

  /* Bouton */
  btn: {
    width:"100%", marginTop:18, padding:"13px 0", borderRadius:12, border:"none",
    background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    transition:"transform .2s, box-shadow .2s",
    letterSpacing:.3,
  },

  /* Divider */
  divider: { display:"flex", alignItems:"center", gap:12, margin:"24px 0 10px" },
  dividerLine: { flex:1, height:1, background:"rgba(255,255,255,0.06)" },
  dividerText: { fontSize:11, color:"#334155", fontWeight:600, letterSpacing:.5, whiteSpace:"nowrap" },

  footer: { fontSize:11, color:"#1e293b", margin:0, letterSpacing:.3 },
};