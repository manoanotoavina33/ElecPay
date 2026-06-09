import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Zap, User, ShieldCheck, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Spinner } from "./Common";

function ZapOrb({ size, top, left, opacity, delay }) {
  return (
    <div style={{
      position:"absolute", top, left, opacity,
      animation: `floatOrb 6s ease-in-out ${delay}s infinite`,
      pointerEvents:"none",
    }}>
      <Zap size={size} color="#818cf8" strokeWidth={1.5} />
    </div>
  );
}

export default function LoginScreen({ onLogin }) {
  const [role, setRole]         = useState("client");
  const [sel, setSel]           = useState("");
  const [pass, setPass]         = useState("");
  const [err, setErr]           = useState("");
  const [tenants, setTenants]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [shake, setShake]       = useState(false);
  const [focused, setFocused]   = useState(null);
  const [showPass, setShowPass] = useState(false);

  const passRef = useRef(null);

  useEffect(() => {
    getDocs(collection(db, "clients"))
      .then(snap => setTenants(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(e => {
        console.error("Firebase error:", e);
        setErr("Erreur Firebase : " + (e.code || e.message));
      })
      .finally(() => setLoading(false));
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = () => {
    setErr("");
    if (role === "admin") {
      if (pass !== "elecpay1234") { setErr("Code d'accès incorrect."); triggerShake(); return; }
      onLogin({ role: "admin" });
    } else {
      const t = tenants.find(x => x.id === sel);
      if (!t) { setErr("Veuillez sélectionner un locataire."); triggerShake(); return; }
      if (t.password && pass !== t.password) { setErr("Mot de passe incorrect."); triggerShake(); return; }
      onLogin({ role: "client", tenant: t });
    }
  };

  /* Bascule showPass SANS perdre le focus */
  const toggleShowPass = (e) => {
    e.preventDefault();
    setShowPass(v => !v);
    setTimeout(() => {
      if (passRef.current) {
        const len = passRef.current.value.length;
        passRef.current.focus();
        passRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  return (
    <div style={ls.wrap}>
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(8deg); }
          66%       { transform: translateY(8px) rotate(-5deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.15; }
          100% { transform: scale(0.92); opacity: 0.6; }
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
        /* Supprime l'œil natif Chrome/Edge/Safari */
        input::-ms-reveal,
        input::-ms-clear { display: none !important; }
        input::placeholder { color: #475569; }
        select option { background: #1e293b; color: #e2e8f0; }
        select { color-scheme: dark; }

        /* Force fond sombre sur autofill Chrome/Edge/Safari */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 999px rgb(13,18,36) inset !important;
          box-shadow: 0 0 0 999px rgb(13,18,36) inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          caret-color: #a5b4fc !important;
        }
      `}</style>

      <div style={ls.bg} />
      <div style={{ ...ls.orb, width:420, height:420, top:"-100px", left:"-100px", animationName:"drift1", animationDuration:"9s" }} />
      <div style={{ ...ls.orb, width:280, height:280, bottom:"20px", right:"-70px", background:"radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)", animationName:"drift2", animationDuration:"11s" }} />
      <div style={{ ...ls.orb, width:200, height:200, top:"38%", right:"8%", background:"radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)", animationName:"drift3", animationDuration:"7s" }} />

      <ZapOrb size={22} top="12%"  left="8%"  opacity={0.25} delay={0}   />
      <ZapOrb size={14} top="70%"  left="6%"  opacity={0.18} delay={1.5} />
      <ZapOrb size={18} top="20%"  left="88%" opacity={0.2}  delay={0.8} />
      <ZapOrb size={11} top="80%"  left="82%" opacity={0.15} delay={2.2} />
      <ZapOrb size={28} top="50%"  left="92%" opacity={0.1}  delay={1}   />

      <div style={{
        ...ls.card,
        animation: shake ? "shake 0.5s ease both" : "slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
      }}>

        {/* Logo */}
        <div style={ls.logoWrap}>
          <div style={ls.pulseRing} />
          <div style={ls.logoIcon}>
            <Zap size={30} color="#fff" strokeWidth={2.5} />
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
              onClick={() => { setRole(key); setErr(""); setPass(""); setSel(""); setShowPass(false); }}
              style={{ ...ls.roleBtn, ...(role === key ? ls.roleBtnActive : {}) }}>
              <Icon size={15} strokeWidth={2} />
              {label}
              {role === key && <div style={ls.roleDot} />}
            </button>
          ))}
        </div>

        {/* Label */}
        <div style={{ textAlign:"left", marginBottom:8 }}>
          <label style={{
            ...ls.fieldLabel,
            color: focused ? "#6366f1" : "#475569",
            transition:"color .2s",
          }}>
            {role === "client" ? "Votre identité" : "Code d'accès"}
          </label>
        </div>

        {/* Champs */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Select locataire (client uniquement) */}
          {role === "client" && (
            loading ? <Spinner /> : (
              <select
                value={sel}
                onChange={e => setSel(e.target.value)}
                onFocus={() => setFocused("sel")}
                onBlur={() => setFocused(null)}
                style={{
                  ...S.inputDark,
                  WebkitTextFillColor:"#e2e8f0",
                  ...(focused === "sel" ? S.inputDarkFocus : {}),
                }}>
                <option value="">— Sélectionner votre nom —</option>
                {[...tenants].sort((a, b) => a.nom.localeCompare(b.nom)).map(t => (
                  <option key={t.id} value={t.id}>{t.nom} ({t.logement})</option>
                ))}
              </select>
            )
          )}

          {/* Champ mot de passe — présent pour les deux rôles */}
          <div style={{ position:"relative" }}>
            <Lock size={15} style={{
              position:"absolute", left:14, top:"50%",
              transform:"translateY(-50%)", color:"#64748b", pointerEvents:"none",
            }} />
            <input
                ref={passRef}
                type="text"
                placeholder={role === "admin" ? "Code d'accès" : "Mot de passe (optionnel)"}
                value={pass}
                onChange={e => setPass(e.target.value)}
                onFocus={() => setFocused("pass")}
                onBlur={() => setFocused(null)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="off"
                style={{
                  ...S.inputDark,
                  paddingLeft: 42,
                  paddingRight: 46,
                  caretColor: "#fff",
                  WebkitTextSecurity: showPass ? "none" : "disc",
                  WebkitTextFillColor: focused === "pass" ? "#000000" : "#CCFFCC", 
                  ...(focused === "pass" ? S.inputDarkFocus : {}),
                }}
            />
            {/* Bouton oeil */}
            <button
              type="button"
              onMouseDown={toggleShowPass}
              tabIndex={-1}
              style={{
                position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", color:"#64748b", cursor:"pointer",
                display:"flex", alignItems:"center", padding:2,
              }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

        </div>

        {/* Erreur */}
        {err && (
          <div style={S.errBox}>
            <span>⚠</span> {err}
          </div>
        )}

        {/* Bouton connexion */}
        <button onClick={handleLogin} style={ls.btn}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,0.4)"; }}>
          Se connecter
          <ChevronRight size={18} style={{ marginLeft:6 }} />
        </button>

        <div style={ls.divider}>
          <div style={ls.dividerLine} />
          <span style={ls.dividerText}>ElecPay v1.1</span>
          <div style={ls.dividerLine} />
        </div>

        <p style={ls.footer}>Vos données sont sécurisées via Firebase</p>
      </div>
    </div>
  );
}

const ls = {
  wrap: {
    minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Segoe UI', system-ui, sans-serif",
    position:"relative", overflow:"hidden",
    background:"#060b18",
  },
  bg: {
    position:"absolute", inset:0, zIndex:0,
    background:[
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.18) 0%, transparent 55%)",
      "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.13) 0%, transparent 50%)",
      "radial-gradient(ellipse at 60% 85%, rgba(6,182,212,0.08) 0%, transparent 50%)",
    ].join(","),
  },
  orb: {
    position:"absolute", borderRadius:"50%", zIndex:0,
    background:"radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
    animationTimingFunction:"ease-in-out", animationIterationCount:"infinite",
  },
  card: {
    position:"relative", zIndex:10,
    width:390, padding:"44px 40px 36px",
    borderRadius:24,
    background:"rgba(15,23,42,0.88)",
    backdropFilter:"blur(28px)",
    border:"1px solid rgba(99,102,241,0.18)",
    boxShadow:[
      "0 32px 80px rgba(0,0,0,0.7)",
      "0 0 0 1px rgba(99,102,241,0.1)",
      "inset 0 1px 0 rgba(255,255,255,0.05)",
    ].join(","),
    textAlign:"center",
    transition:"transform 0.2s ease",
  },
  logoWrap: {
    position:"relative", display:"inline-flex", alignItems:"center",
    justifyContent:"center", marginBottom:20, width:72, height:72,
  },
  pulseRing: {
    position:"absolute", inset:-6, borderRadius:"50%",
    border:"2px solid rgba(99,102,241,0.4)",
    animation:"pulse-ring 3s ease-in-out infinite",
  },
  logoIcon: {
    width:64, height:64, borderRadius:18,
    background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 8px 28px rgba(99,102,241,0.5)",
  },
  title: { margin:"0 0 6px", fontSize:30, fontWeight:900, letterSpacing:-1, color:"#f1f5f9" },
  sub:   { margin:"0 0 28px", fontSize:13, color:"#64748b", letterSpacing:.2 },
  roleToggle: {
    display:"flex", gap:6, marginBottom:28,
    background:"rgba(255,255,255,0.05)",
    borderRadius:14, padding:5,
    border:"1px solid rgba(255,255,255,0.06)",
  },
  roleBtn: {
    flex:1, padding:"9px 0", borderRadius:10, border:"none",
    background:"transparent", color:"#64748b", cursor:"pointer",
    fontSize:13, fontWeight:600, display:"flex", alignItems:"center",
    justifyContent:"center", gap:7, transition:"all .2s",
    position:"relative", fontFamily:"inherit",
  },
  roleBtnActive: {
    background:"rgba(99,102,241,0.2)", color:"#a5b4fc",
    boxShadow:"0 2px 8px rgba(0,0,0,0.2)",
    border:"1px solid rgba(99,102,241,0.3)",
  },
  roleDot: {
    position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)",
    width:4, height:4, borderRadius:"50%", background:"#818cf8",
  },
  fieldLabel: {
    fontSize:11, fontWeight:700,
    textTransform:"uppercase", letterSpacing:.6, marginLeft:2,
  },
  btn: {
    width:"100%", marginTop:18, padding:"13px 0", borderRadius:12, border:"none",
    background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    transition:"transform .2s, box-shadow .2s",
    letterSpacing:.3, fontFamily:"inherit",
  },
  divider: { display:"flex", alignItems:"center", gap:12, margin:"24px 0 10px" },
  dividerLine: { flex:1, height:1, background:"rgba(255,255,255,0.06)" },
  dividerText: { fontSize:11, color:"#334155", fontWeight:600, letterSpacing:.5, whiteSpace:"nowrap" },
  footer: { fontSize:11, color:"#334155", margin:0, letterSpacing:.3 },
};