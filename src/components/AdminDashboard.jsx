import { useState, useEffect, useCallback } from "react";
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, query, where
} from "firebase/firestore";
import {
  Zap, LayoutDashboard, Users, CreditCard, Bell, LogOut,
  CheckCircle, XCircle, DollarSign, Plus,
  Pencil, Trash2, Send, ShieldCheck, Home, Phone, Menu, X,
  Search, RefreshCw, User, AlertTriangle, ChevronRight, Lock, Calendar,
  Eye, EyeOff
} from "lucide-react";
import { db, functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt, getRecentMonths } from "../utils/helpers";
const T = {
  bg0:         "#07080d",
  bg1:         "#0d0f1a",
  bg2:         "#12152a",
  bg3:         "#1a1f38",
  bg4:         "#222848",
  border:      "rgba(99,120,255,0.12)",
  borderHover: "rgba(99,120,255,0.28)",
  accent:      "#5b6ef5",
  accentGlow:  "rgba(91,110,245,0.35)",
  accentSoft:  "rgba(91,110,245,0.12)",
  text0:       "#fff",
  text1:       "#9ba3c4",
  text2:       "#5c6380",
  text3:       "#333333",
  success:     "#3ecf8e",
  successSoft: "rgba(62,207,142,0.12)",
  danger:      "#f87171",
  dangerSoft:  "rgba(248,113,113,0.12)",
  warn:        "#fbbf24",
  warnSoft:    "rgba(251,191,36,0.1)",
};

const CSS_ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes slideInLeft {
    from { opacity:0; transform:translateX(-20px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow:0 0 8px rgba(91,110,245,0.3); }
    50%      { box-shadow:0 0 20px rgba(91,110,245,0.55); }
  }
  .fade-up    { animation:fadeUp 0.32s ease both; }
  .fade-in    { animation:fadeIn 0.24s ease both; }
  .slide-left { animation:slideInLeft 0.28s ease both; }
  .stagger > * { animation:fadeUp 0.28s ease both; }
  .stagger > *:nth-child(1) { animation-delay:0.04s; }
  .stagger > *:nth-child(2) { animation-delay:0.08s; }
  .stagger > *:nth-child(3) { animation-delay:0.12s; }
  .stagger > *:nth-child(4) { animation-delay:0.16s; }
  .stagger > *:nth-child(5) { animation-delay:0.20s; }
  .stagger > *:nth-child(6) { animation-delay:0.24s; }
  .stat-card:hover  { border-color:rgba(91,110,245,0.28) !important; transform:translateY(-2px) !important; }
  .nav-item:hover   { background:rgba(91,110,245,0.08) !important; color:#a5b0ff !important; }
  .table-row:hover  { background:rgba(91,110,245,0.05) !important; }
  .logout-btn:hover { background:rgba(248,113,113,0.12) !important; border-color:rgba(248,113,113,0.35) !important; }
  .mob-card:hover   { border-color:rgba(91,110,245,0.28) !important; }
  .logo-icon        { animation:pulse-glow 3s ease-in-out infinite; }
  ::-webkit-scrollbar       { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(91,110,245,0.25); border-radius:2px; }
  select option { background:#0d0f1a; color:#f0f2ff; }
  input::placeholder { color:rgba(155,163,196,0.5); }
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 999px #12152a inset !important;
    -webkit-text-fill-color:#f0f2ff !important;
  }
`;

const S = {
  appWrap: {
    display:"flex", minHeight:"100vh",
    background:T.bg0, fontFamily:"'DM Sans',system-ui,sans-serif",
    color:T.text0,
  },
  sidebar: {
    width:240, flexShrink:0,
    background:T.bg1,
    borderRight:`1px solid ${T.border}`,
    display:"flex", flexDirection:"column",
    position:"fixed", top:0, left:0, height:"100vh",
    zIndex:100,
  },
  sidebarLogo: {
    padding:"22px 20px 18px",
    display:"flex", alignItems:"center", gap:11,
    borderBottom:`1px solid ${T.border}`,
  },
  logoIcon: {
    width:34, height:34, borderRadius:9,
    background:T.accent,
    boxShadow:`0 0 16px ${T.accentGlow}`,
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0,
  },
  logoText: { fontSize:15, fontWeight:700, color:T.text0, letterSpacing:"-0.3px" },
  logoSub:  { fontSize:10, color:T.text2, letterSpacing:"0.06em", textTransform:"uppercase" },
  sidebarNav: {
    flex:1, padding:"16px 10px", overflowY:"auto",
    display:"flex", flexDirection:"column", gap:2,
  },
  navSection: {
    fontSize:10, fontWeight:700, color:T.text2,
    letterSpacing:"0.1em", textTransform:"uppercase",
    padding:"8px 10px 6px",
  },
  navItem: (active) => ({
    width:"100%", display:"flex", alignItems:"center", gap:10,
    padding:"9px 12px", borderRadius:9, border:"none", cursor:"pointer",
    background: active ? T.accentSoft : "transparent",
    color:      active ? T.accent     : T.text1,
    fontSize:13, fontWeight: active ? 600 : 400,
    textAlign:"left", outline:"none",
    transition:"background 0.18s, color 0.18s",
    borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
    fontFamily:"inherit",
  }),
  navDot: {
    width:6, height:6, borderRadius:"50%",
    background:T.accent, marginLeft:"auto", flexShrink:0,
    boxShadow:`0 0 6px ${T.accentGlow}`,
  },
  navBadge: {
    fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:20,
    background:"rgba(248,113,113,0.15)", color:T.danger,
    border:"1px solid rgba(248,113,113,0.25)", marginLeft:"auto",
  },
  sidebarBottom: {
    padding:"12px 10px", borderTop:`1px solid ${T.border}`,
    display:"flex", flexDirection:"column", gap:8,
  },
  userCard: {
    display:"flex", alignItems:"center", gap:10,
    padding:"10px 12px", borderRadius:10,
    background:T.bg3, border:`1px solid ${T.border}`,
  },
  avatar: (size=32, radius=9) => ({
    width:size, height:size, borderRadius:radius,
    background:`linear-gradient(135deg, ${T.accent}, #8b5cf6)`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.38, fontWeight:700, color:"#fff", flexShrink:0,
    letterSpacing:"-0.5px",
  }),
  avatarWarn: (size=32, radius=9) => ({
    width:size, height:size, borderRadius:radius,
    background:"linear-gradient(135deg, #f59e0b, #d97706)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.38, fontWeight:700, color:"#fff", flexShrink:0,
  }),
  logoutBtn: {
    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
    padding:"9px 12px", borderRadius:9,
    border:"1px solid rgba(248,113,113,0.2)",
    background:"rgba(248,113,113,0.06)", color:"#f87171",
    fontSize:12, fontWeight:600, cursor:"pointer", width:"100%",
    transition:"background 0.18s, border-color 0.18s",
    letterSpacing:"0.01em", fontFamily:"inherit",
  },
  main: {
    flex:1, marginLeft:240,
    display:"flex", flexDirection:"column", minHeight:"100vh",
  },
  header: {
    padding:"18px 28px",
    background:T.bg1, borderBottom:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:10,
    backdropFilter:"blur(12px)",
  },
  pageTitle: { fontSize:18, fontWeight:700, color:T.text0, letterSpacing:"-0.4px", margin:0 },
  pageSub:   { margin:"2px 0 0", fontSize:12, color:T.text2 },
  headerRight: { display:"flex", alignItems:"center", gap:8 },
  refreshBtn: {
    display:"flex", alignItems:"center", gap:6,
    padding:"8px 14px", borderRadius:9,
    border:`1px solid ${T.border}`, background:"rgba(255,255,255,0.04)",
    color:T.text1, fontSize:13, fontWeight:600, cursor:"pointer",
    fontFamily:"inherit", transition:"all .15s",
  },
  adminPill: {
    display:"flex", alignItems:"center", gap:6,
    padding:"7px 14px", borderRadius:20,
    background:T.accentSoft, color:T.accent,
    fontSize:12, fontWeight:700, border:`1px solid ${T.border}`,
  },
  content: { flex:1, padding:"24px 28px", overflowY:"auto" },
  card: {
    background:T.bg2,
    border:`1px solid ${T.border}`,
    borderRadius:14, overflow:"hidden",
  },
  cardHeader: {
    padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
  },
  cardTitle: { fontSize:14, fontWeight:700, color:T.text0, margin:0 },
  statsGrid: {
    display:"grid", gridTemplateColumns:"repeat(4,1fr)",
    gap:12, marginBottom:16,
  },
  statCard: {
    background:T.bg2, border:`1px solid ${T.border}`,
    borderRadius:13, padding:"18px 20px",
    display:"flex", flexDirection:"column", gap:10,
    transition:"border-color 0.2s, transform 0.2s",
  },
  statCardTop: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  statIconWrap: {
    width:40, height:40, borderRadius:10,
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  statVal:   { fontSize:28, fontWeight:900, lineHeight:1, letterSpacing:-1 },
  statLabel: { fontSize:11, color:T.text2, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginTop:2 },
  sectionRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 },
  progressWrap: {
    height:6, borderRadius:99,
    background:"rgba(255,255,255,0.06)",
    overflow:"hidden", margin:"10px 0 8px",
  },
  tableHead: {
    display:"grid", padding:"10px 20px",
    fontSize:11, fontWeight:700, color:T.text2,
    textTransform:"uppercase", letterSpacing:"0.08em",
    borderBottom:`1px solid ${T.border}`,
  },
  tableRow: {
    display:"grid", padding:"13px 20px",
    borderBottom:`1px solid rgba(99,120,255,0.06)`,
    fontSize:13, alignItems:"center",
    transition:"background 0.15s", cursor:"default", color:T.text0,
  },
  emptyState: {
    padding:"48px 20px", textAlign:"center",
    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
    color:T.text2,
  },
  btnPrimary: {
    display:"inline-flex", alignItems:"center", gap:7,
    padding:"9px 18px", borderRadius:9, border:"none",
    background:`linear-gradient(135deg, ${T.accent}, #8b5cf6)`,
    color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
    boxShadow:`0 2px 12px ${T.accentGlow}`, fontFamily:"inherit",
    transition:"opacity .2s",
  },
  btnSmallGreen: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 11px", borderRadius:7,
    border:"1px solid rgba(62,207,142,0.25)",
    background:T.successSoft, color:T.success,
    fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
  },
  btnSmallBlue: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 11px", borderRadius:7,
    border:`1px solid ${T.border}`,
    background:T.accentSoft, color:T.accent,
    fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
  },
  btnSmallRed: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 11px", borderRadius:7,
    border:"1px solid rgba(248,113,113,0.25)",
    background:T.dangerSoft, color:T.danger,
    fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
  },
  btnViewAll: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"6px 13px", borderRadius:8,
    border:`1px solid ${T.border}`, background:T.accentSoft,
    color:T.accent, fontWeight:700, fontSize:12, cursor:"pointer",
    fontFamily:"inherit",
  },
  btnOutline: {
    display:"inline-flex", alignItems:"center", gap:7,
    padding:"9px 18px", borderRadius:9,
    border:`1.5px solid ${T.border}`, background:"rgba(255,255,255,0.03)",
    color:T.text1, fontWeight:600, fontSize:13, cursor:"pointer",
    fontFamily:"inherit",
  },
  alertWarn: {
    display:"flex", gap:12, alignItems:"flex-start",
    padding:"14px 16px", borderRadius:12,
    background:T.warnSoft, border:"1px solid rgba(251,191,36,0.2)",
    marginBottom:14,
  },
  searchInput: {
    padding:"9px 12px 9px 34px", borderRadius:9,
    border:`1.5px solid ${T.border}`, background:"rgba(255,255,255,0.04)",
    fontSize:13, color:"#00004d", outline:"none",
    transition:"border-color .2s", fontFamily:"inherit",
    WebkitTextFillColor: "#000000",
    colorScheme:"dark",
  },
  overlay: {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
    backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
    justifyContent:"center", zIndex:200,
  },
  modalCard: {
    background:T.bg2, borderRadius:18, padding:"28px 30px",
    width:420, boxShadow:"0 24px 60px rgba(0,0,0,0.6)",
    maxHeight:"90vh", overflowY:"auto",
    border:`1px solid rgba(91,110,245,0.25)`,
  },
  modalTitle: { margin:0, fontSize:18, fontWeight:800, color:T.text0 },
  label: {
    display:"block", fontSize:11, fontWeight:700, color:T.text2,
    marginBottom:6, textTransform:"uppercase", letterSpacing:.5,
  },
  modalInput: {
    width:"100%", padding:"10px 12px 10px 38px",
    borderRadius:9, border:`1.5px solid ${T.border}`,
    fontSize:13, color:"#e8eaf6", outline:"none",
    boxSizing:"border-box", background:"#1a1f38",
    transition:"border-color .15s", fontFamily:"inherit",
    WebkitTextFillColor:"#00001a",
    colorScheme:"dark",
  },
  notifCard: {
    background:T.bg2, borderRadius:16, padding:"28px",
    border:`1px solid ${T.border}`, textAlign:"center",
  },
  notifIconWrap: {
    width:60, height:60, borderRadius:16,
    background:T.accentSoft, border:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  notifRow: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"12px 14px", background:"rgba(255,255,255,0.03)",
    borderRadius:10, marginBottom:8, border:`1px solid ${T.border}`,
  },
  notifSuccess: {
    display:"flex", alignItems:"center", gap:8,
    background:T.successSoft, color:T.success,
    border:"1px solid rgba(62,207,142,0.25)",
    borderRadius:10, padding:"12px 16px", fontWeight:600, fontSize:13, marginTop:12,
  },
  topbar: {
    padding:"14px 16px",
    background:T.bg1, borderBottom:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:50,
  },
  bottomNav: {
    position:"fixed", bottom:0, left:0, right:0,
    background:T.bg1, borderTop:`1px solid ${T.border}`,
    display:"flex", alignItems:"stretch", zIndex:100,
    paddingBottom:"env(safe-area-inset-bottom,0px)",
  },
  bottomNavItem: (active) => ({
    flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", gap:4, padding:"10px 0",
    background:"none", border:"none", cursor:"pointer",
    color: active ? T.accent : T.text2,
    fontSize:10, fontWeight: active ? 700 : 500,
    transition:"color 0.18s", fontFamily:"inherit",
  }),
  mobCard: {
    background:T.bg2, borderRadius:12,
    border:`1px solid ${T.border}`,
    padding:"14px 16px", marginBottom:8,
    transition:"border-color 0.18s",
  },
  mobRow: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"5px 0", borderBottom:`1px solid rgba(99,120,255,0.06)`,
  },
  mobLabel: { fontSize:11, color:T.text2, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" },
  mobVal:   { fontSize:13, fontWeight:500, color:T.text0 },
};

function DarkBadge({ statut }) {
  const ok  = statut === "payé";
  const mid = statut === "retard";
  const color = ok ? T.success : mid ? T.warn : T.danger;
  const bg    = ok ? T.successSoft : mid ? T.warnSoft : T.dangerSoft;
  const label = ok ? "Payé" : mid ? "Retard" : "En attente";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
      background:bg, color,
      border:`1px solid ${color}33`, letterSpacing:"0.04em",
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:color }}/>
      {label}
    </span>
  );
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

export default function AdminDashboard({ onLogout }) {
  const [tenants,      setTenants]      = useState([]);
  const [payments,     setPayments]     = useState([]);
  const [tab,          setTab]          = useState("dashboard");
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState({});
  const [loading,      setLoading]      = useState(true);
  const [notifSent,    setNotifSent]    = useState(false);
  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [search,       setSearch]       = useState("");
  const [isMobile,     setIsMobile]     = useState(window.innerWidth <= 768);
  const [selMois,      setSelMois]      = useState(CURRENT_MONTH);
  const [focusedInput, setFocusedInput] = useState(null);
  // ── NOUVEAU : toggle visibilité mot de passe ──
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const id = "elecpay-admin-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS_ANIM;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [tSnap, pSnap] = await Promise.all([
        getDocs(collection(db, "clients")),
        getDocs(collection(db, "paiements")),
      ]);
      setTenants(tSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      setPayments(pSnap.docs.map(d => ({ id:d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const stats = {
    total:    tenants.length,
    payes:    tenants.filter(t => t.statut === "payé" && t.mois === selMois).length,
    nonPayes: tenants.filter(t => !(t.statut === "payé" && t.mois === selMois)).length,
    retards:  tenants.filter(t => t.statut === "retard").length,
    revenus:  payments.filter(p => p.mois === selMois).reduce((a,p) => a+(p.montant||0), 0),
    taux:     tenants.length
      ? Math.round((tenants.filter(t => t.statut==="payé" && t.mois===selMois).length / tenants.length)*100)
      : 0,
  };

  const filteredTenants = tenants.filter(t =>
    t.nom?.toLowerCase().includes(search.toLowerCase()) ||
    t.logement?.toLowerCase().includes(search.toLowerCase())
  );
  const effectiveStatut = (t) =>
    (t.statut === "payé" && t.mois === selMois) ? "payé" : "non payé";

  const openModal  = (type, data={}) => {
    setShowPassword(false);
    setModal({type}); setForm({mois:selMois, ...data});
  };
  const closeModal = () => { setModal(null); setForm({}); setShowPassword(false); };

  const saveTenant = async () => {
    if (!form.nom || !form.logement || !form.montant) return;
    try {
      if (form.id) {
        const {id, ...data} = form;
        await updateDoc(doc(db,"clients",id), data);
      } else {
        await addDoc(collection(db,"clients"), {
          ...form, statut:"non payé", datePaiement:null, mois:CURRENT_MONTH,
        });
      }
      await loadAll();
    } catch(e) { console.error(e); }
    closeModal();
  };

  const deleteTenant = async (id) => {
    if (!window.confirm("Supprimer ce locataire ?")) return;
    try {
      await deleteDoc(doc(db,"clients",id));
      const snap = await getDocs(query(collection(db,"paiements"), where("clientId","==",id)));
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
      await loadAll();
    } catch(e) { console.error(e); }
  };

  const markPaid = async (tenantId) => {
    const today  = new Date().toISOString().split("T")[0];
    const tenant = tenants.find(t => t.id===tenantId);
    try {
      await updateDoc(doc(db,"clients",tenantId), {statut:"payé", datePaiement:today, mois:selMois});
      if (tenant) {
        await addDoc(collection(db,"paiements"), {
          clientId:tenantId, montant:tenant.montant, date:today, mois:selMois, statut:"payé",
        });
      }
      await loadAll();
    } catch(e) { console.error(e); }
  };

  const navItems = [
    { key:"dashboard", Icon:LayoutDashboard, label:"Tableau de bord" },
    { key:"tenants",   Icon:Users,           label:"Locataires" },
    { key:"payments",  Icon:CreditCard,      label:"Paiements" },
    { key:"notifs",    Icon:Bell,            label:"Notifications",
      badge: tenants.filter(t => !(t.statut === "payé" && t.mois === selMois)).length || null },
  ];

  const SidebarInner = ({ onNav }) => (
    <>
      <div style={S.sidebarLogo}>
        <div style={S.logoIcon} className="logo-icon">
          <Zap size={17} color="#fff" strokeWidth={2.5}/>
        </div>
        <div>
          <div style={S.logoText}>ElecPay</div>
          <div style={S.logoSub}>Électricité</div>
        </div>
      </div>
      <nav style={S.sidebarNav}>
        <div style={S.navSection}>Menu</div>
        {navItems.map(({key, Icon, label, badge}) => (
          <button key={key} className="nav-item"
            onClick={() => { setTab(key); onNav?.(); }}
            style={S.navItem(tab===key)}>
            <Icon size={16} strokeWidth={tab===key ? 2.5 : 1.8}/>
            <span style={{flex:1}}>{label}</span>
            {badge
              ? <span style={S.navBadge}>{badge}</span>
              : tab===key && <div style={S.navDot}/>
            }
          </button>
        ))}
      </nav>
      <div style={S.sidebarBottom}>
        <div style={S.userCard}>
          <div style={S.avatarWarn(32,9)}>
            <ShieldCheck size={16} color="#fff"/>
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:700, color:T.text0}}>Administrateur</div>
            <div style={{fontSize:11, color:T.text2}}>Accès complet</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout} style={S.logoutBtn}>
          <LogOut size={13}/> Déconnexion
        </button>
      </div>
    </>
  );

  const TenantRowCard = ({t}) => (
    <div className="mob-card" style={S.mobCard}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
        <div style={S.avatar(34,9)}>{t.nom?.[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, fontSize:14, color:T.text0}}>{t.nom}</div>
          <div style={{fontSize:12, color:T.text2}}>{t.logement}</div>
        </div>
        <DarkBadge statut={effectiveStatut(t)}/>
      </div>
      <div style={S.mobRow}>
        <span style={S.mobLabel}>Montant</span>
        <span style={{...S.mobVal, fontWeight:700, color:T.accent}}>{fmt(t.montant)}</span>
      </div>
      <div style={{...S.mobRow, borderBottom:"none"}}>
        <span style={S.mobLabel}>Date paiement</span>
        <span style={{...S.mobVal, color:T.text2}}>{fmtDate(t.datePaiement)}</span>
      </div>
      {effectiveStatut(t) !== "payé" && (
        <button onClick={() => markPaid(t.id)}
          style={{...S.btnSmallGreen, marginTop:10, width:"100%", justifyContent:"center", padding:"9px"}}>
          <CheckCircle size={14}/> Encaisser
        </button>
      )}
    </div>
  );

  const TenantManageCard = ({t}) => (
    <div className="mob-card" style={S.mobCard}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
        <div style={S.avatar(34,9)}>{t.nom?.[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, fontSize:14, color:T.text0}}>{t.nom}</div>
          <div style={{fontSize:12, color:T.text2}}>{t.logement} · {t.telephone||"—"}</div>
        </div>
        <DarkBadge statut={effectiveStatut(t)}/>
      </div>
      <div style={S.mobRow}>
        <span style={S.mobLabel}>Montant</span>
        <span style={{...S.mobVal, fontWeight:700, color:T.accent}}>{fmt(t.montant)}</span>
      </div>
      <div style={{display:"flex", gap:6, marginTop:10}}>
        {effectiveStatut(t) !== "payé" && (
          <button onClick={() => markPaid(t.id)} style={{...S.btnSmallGreen, flex:1, justifyContent:"center"}}>
            <CheckCircle size={12}/> Encaisser
          </button>
        )}
        <button onClick={() => openModal("tenant",{...t})} style={{...S.btnSmallBlue, flex:1, justifyContent:"center"}}>
          <Pencil size={12}/> Modifier
        </button>
        <button onClick={() => deleteTenant(t.id)} style={{...S.btnSmallRed, flex:1, justifyContent:"center"}}>
          <Trash2 size={12}/> Suppr.
        </button>
      </div>
    </div>
  );

  const PaymentCard = ({p}) => {
    const t = tenants.find(x => x.id===p.clientId);
    return (
      <div className="mob-card" style={S.mobCard}>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
          <div style={S.avatar(32,8)}>{t?.nom?.[0]||"?"}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700, fontSize:14, color:T.text0}}>{t?.nom||"—"}</div>
            <div style={{fontSize:12, color:T.text2}}>{p.mois}</div>
          </div>
          <DarkBadge statut={p.statut}/>
        </div>
        <div style={S.mobRow}>
          <span style={S.mobLabel}>Montant</span>
          <span style={{...S.mobVal, fontWeight:700, color:T.accent}}>{fmt(p.montant)}</span>
        </div>
        <div style={{...S.mobRow, borderBottom:"none"}}>
          <span style={S.mobLabel}>Date</span>
          <span style={{...S.mobVal, color:T.text2}}>{fmtDate(p.date)}</span>
        </div>
      </div>
    );
  };

  const currentNav = navItems.find(n => n.key===tab);

  // ── Champs du formulaire locataire ──
  const formFields = [
    { key:"nom",       label:"Nom complet",          Icon:User,       type:"text"     },
    { key:"logement",  label:"N° de logement",       Icon:Home,       type:"text"     },
    { key:"telephone", label:"Téléphone",            Icon:Phone,      type:"text"     },
    { key:"montant",   label:"Montant mensuel (Ar)", Icon:DollarSign, type:"number"   },
    { key:"password",  label:"Mot de passe",         Icon:Lock,       type:"password" },
  ];

  return (
    <div style={S.appWrap}>

      {!isMobile && (
        <aside style={S.sidebar} className="slide-left">
          <SidebarInner/>
        </aside>
      )}

      {isMobile && isMenuOpen && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
          backdropFilter:"blur(4px)", zIndex:200,
          animation:"fadeIn 0.18s ease both",
        }} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            position:"fixed", left:0, top:0, height:"100vh", width:260,
            background:T.bg1, display:"flex", flexDirection:"column",
            borderRight:`1px solid ${T.border}`,
            animation:"slideInLeft 0.22s ease both",
          }} onClick={e => e.stopPropagation()}>
            <SidebarInner onNav={() => setIsMenuOpen(false)}/>
          </div>
        </div>
      )}

      <main style={{...S.main, marginLeft: isMobile ? 0 : 240}}>

        <header style={{...S.header, padding: isMobile ? "13px 16px" : "18px 28px"}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            {isMobile && (
              <button onClick={() => setIsMenuOpen(true)}
                style={{background:"none", border:"none", cursor:"pointer", padding:4, display:"flex"}}>
                <Menu size={21} color={T.text0}/>
              </button>
            )}
            <div>
              <h2 style={{...S.pageTitle, fontSize: isMobile ? 16 : 18}}>
                {currentNav?.label}
              </h2>
              <div style={{position:"relative", display:"inline-flex", alignItems:"center", marginTop:3}}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"3px 10px 3px 8px", borderRadius:20,
                  border:`1.5px solid ${T.border}`,
                  background:T.accentSoft,
                }}>
                  <Calendar size={12} color={T.accent}/>
                  <span style={{fontWeight:700, color:T.accent, fontSize:12}}>{selMois}</span>
                  <span style={{fontSize:9, color:T.accent}}>▼</span>
                </div>
                <select value={selMois} onChange={e => setSelMois(e.target.value)}
                  style={{position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", border:"none", background:"transparent"}}>
                  {getRecentMonths().map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={S.headerRight}>
            <button onClick={loadAll} style={S.refreshBtn}>
              <RefreshCw size={14}/>{!isMobile && " Actualiser"}
            </button>
            {!isMobile && <div style={S.adminPill}><ShieldCheck size={13}/> Admin</div>}
          </div>
        </header>

        <div style={{...S.content, padding: isMobile ? "16px 14px 90px" : "24px 28px"}}>
          {loading ? (
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:200}}>
              <Spinner/>
            </div>
          ) : (
            <>

              {tab === "dashboard" && (
                <div className="fade-up">
                  <div style={{
                    ...S.statsGrid,
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
                    gap: isMobile ? 10 : 12,
                  }} className="stagger">
                    {[
                      { label:"Total locataires",    val:stats.total,        color:T.accent,  bg:T.accentSoft,  Icon:Users },
                      { label:`Payés (${selMois})`,  val:stats.payes,        color:T.success, bg:T.successSoft, Icon:CheckCircle, badge:`${stats.taux}%` },
                      { label:"En attente",          val:stats.nonPayes,     color:T.danger,  bg:T.dangerSoft,  Icon:XCircle },
                      { label:`Revenus (${selMois})`,val:fmt(stats.revenus), color:"#60a5fa", bg:"rgba(96,165,250,0.1)", Icon:DollarSign },
                    ].map(({label, val, color, bg, Icon, badge}) => (
                      <div key={label} className="stat-card" style={{
                        ...S.statCard, borderTop:`3px solid ${color}`,
                        padding: isMobile ? "14px" : "18px 20px",
                      }}>
                        <div style={S.statCardTop}>
                          <div style={{...S.statIconWrap, background:bg}}>
                            <Icon size={20} color={color} strokeWidth={2}/>
                          </div>
                          {badge && (
                            <span style={{fontSize:11, fontWeight:800, color, background:bg, padding:"3px 9px", borderRadius:20}}>
                              {badge}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{...S.statVal, color, fontSize: isMobile ? 22 : 28}}>{val}</div>
                          <div style={S.statLabel}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    ...S.sectionRow,
                    gridTemplateColumns: isMobile ? "1fr" : (stats.nonPayes > 0 ? "1fr 1fr" : "1fr"),
                  }}>
                    <div style={{...S.card, padding:"20px 22px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <span style={{fontWeight:700, fontSize:14, color:T.text0}}>Taux de paiement</span>
                        <span style={{fontWeight:800, fontSize:20, color:T.accent}}>{stats.taux}%</span>
                      </div>
                      <div style={S.progressWrap}>
                        <div style={{height:"100%", borderRadius:99,
                          background:`linear-gradient(90deg,${T.accent},#8b5cf6)`,
                          width:`${stats.taux}%`, transition:"width .6s ease"}}/>
                      </div>
                      <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:T.text2}}>
                        <span>{stats.payes} payé{stats.payes>1?"s":""}</span>
                        <span>{stats.total-stats.payes} restant{stats.total-stats.payes>1?"s":""}</span>
                      </div>
                    </div>

                    {stats.nonPayes > 0 && (
                      <div style={{
                        ...S.card, padding:"20px 22px",
                        borderLeft:`3px solid ${T.warn}`,
                        background:T.warnSoft,
                        border:`1px solid rgba(251,191,36,0.18)`,
                      }}>
                        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
                          <AlertTriangle size={15} color={T.warn}/>
                          <span style={{fontSize:13, fontWeight:700, color:T.warn}}>
                            Alertes ({stats.nonPayes})
                          </span>
                        </div>
                        <div style={{display:"flex", flexDirection:"column", gap:6, maxHeight:110, overflowY:"auto"}}>
                          {tenants.filter(t => !(t.statut === "payé" && t.mois === selMois)).slice(0,5).map(t => (
                            <div key={t.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12}}>
                              <span style={{fontWeight:600, color:T.text0}}>{t.nom}</span>
                              <DarkBadge statut={effectiveStatut(t)}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={S.card}>
                    <div style={S.cardHeader}>
                      <h3 style={S.cardTitle}>Paiements — {selMois}</h3>
                      <button onClick={() => setTab("tenants")} style={S.btnViewAll}>
                        Voir tout <ChevronRight size={13}/>
                      </button>
                    </div>
                    {isMobile ? (
                      <div style={{padding:12}}>
                        {tenants.slice(0,5).map(t => <TenantRowCard key={t.id} t={t}/>)}
                      </div>
                    ) : (
                      <div style={{overflowX:"auto"}}>
                        <div style={{minWidth:640}}>
                          <div style={{...S.tableHead, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr"}}>
                            <span>Locataire</span><span>Logement</span>
                            <span>Montant</span><span>Statut</span><span>Actions</span>
                          </div>
                          <div className="stagger">
                            {tenants.slice(0,5).map(t => (
                              <div key={t.id} className="table-row"
                                style={{...S.tableRow, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr"}}>
                                <span style={{display:"flex", alignItems:"center", gap:10, fontWeight:600}}>
                                  <div style={S.avatar(28,8)}>{t.nom?.[0]}</div>{t.nom}
                                </span>
                                <span style={{color:T.text2}}>{t.logement}</span>
                                <span style={{fontWeight:700, color:T.accent}}>{fmt(t.montant)}</span>
                                <DarkBadge statut={effectiveStatut(t)}/>
                                <span>
                                  {effectiveStatut(t) !== "payé"
                                    ? <button onClick={() => markPaid(t.id)} style={S.btnSmallGreen}><CheckCircle size={13}/> Encaisser</button>
                                    : <span style={{fontSize:12, color:T.success, fontWeight:600}}>✓ {fmtDate(t.datePaiement)}</span>
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === "tenants" && (
                <div className="fade-up">
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10}}>
                    <div style={{position:"relative", flex: isMobile ? 1 : undefined}}>
                      <Search size={14} style={{position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.text2, pointerEvents:"none"}}/>
                      <input
                        placeholder="Rechercher…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{...S.searchInput, width: isMobile ? "100%" : 220, boxSizing:"border-box"}}
                      />
                    </div>
                    <button onClick={() => openModal("tenant")} style={S.btnPrimary}>
                      <Plus size={15}/> {isMobile ? "Ajouter" : "Nouveau locataire"}
                    </button>
                  </div>
                  <div style={S.card}>
                    <div style={S.cardHeader}>
                      <h3 style={S.cardTitle}>
                        Locataires <span style={{fontWeight:400, color:T.text2}}>({filteredTenants.length})</span>
                      </h3>
                    </div>
                    {isMobile ? (
                      <div style={{padding:12}}>
                        {filteredTenants.map(t => <TenantManageCard key={t.id} t={t}/>)}
                        {filteredTenants.length===0 && (
                          <div style={S.emptyState}><Users size={36} strokeWidth={1}/><p>Aucun locataire trouvé</p></div>
                        )}
                      </div>
                    ) : (
                      <div style={{overflowX:"auto"}}>
                        <div style={{minWidth:750}}>
                          <div style={{...S.tableHead, gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 1fr 1.8fr"}}>
                            <span>Nom</span><span>Logement</span><span>Téléphone</span>
                            <span>Montant</span><span>Statut</span><span>Actions</span>
                          </div>
                          <div className="stagger">
                            {filteredTenants.map(t => (
                              <div key={t.id} className="table-row"
                                style={{...S.tableRow, gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 1fr 1.8fr"}}>
                                <span style={{display:"flex", alignItems:"center", gap:10, fontWeight:600}}>
                                  <div style={S.avatar(32,9)}>{t.nom?.[0]}</div>{t.nom}
                                </span>
                                <span style={{color:T.text2}}>{t.logement}</span>
                                <span style={{color:T.text2, fontSize:13}}>{t.telephone||"—"}</span>
                                <span style={{fontWeight:700, color:T.accent}}>{fmt(t.montant)}</span>
                                <DarkBadge statut={effectiveStatut(t)}/>
                                <div style={{display:"flex", gap:6}}>
                                  {effectiveStatut(t)!=="payé" && (
                                    <button onClick={() => markPaid(t.id)} style={S.btnSmallGreen}><CheckCircle size={12}/></button>
                                  )}
                                  <button onClick={() => openModal("tenant",{...t})} style={S.btnSmallBlue}><Pencil size={12}/> Modifier</button>
                                  <button onClick={() => deleteTenant(t.id)} style={S.btnSmallRed}><Trash2 size={12}/> Suppr.</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {filteredTenants.length===0 && (
                            <div style={S.emptyState}><Users size={36} strokeWidth={1}/><p>Aucun locataire trouvé</p></div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === "payments" && (
                <div style={S.card} className="fade-up">
                  <div style={S.cardHeader}>
                    <h3 style={S.cardTitle}>Historique des transactions</h3>
                    <span style={{fontSize:13, color:T.text2}}>{payments.length} entrées</span>
                  </div>
                  {isMobile ? (
                    <div style={{padding:12}}>
                      {[...payments].reverse().map(p => <PaymentCard key={p.id} p={p}/>)}
                      {payments.length===0 && (
                        <div style={S.emptyState}><CreditCard size={36} strokeWidth={1}/><p>Aucun paiement</p></div>
                      )}
                    </div>
                  ) : (
                    <div style={{overflowX:"auto"}}>
                      <div style={{minWidth:600}}>
                        <div style={{...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr"}}>
                          <span>Locataire</span><span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                        </div>
                        <div className="stagger">
                          {[...payments].reverse().map(p => {
                            const t = tenants.find(x => x.id===p.clientId);
                            return (
                              <div key={p.id} className="table-row"
                                style={{...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr"}}>
                                <span style={{display:"flex", alignItems:"center", gap:10, fontWeight:600}}>
                                  <div style={S.avatar(28,8)}>{t?.nom?.[0]||"?"}</div>{t?.nom||"—"}
                                </span>
                                <span style={{color:T.text2}}>{p.mois}</span>
                                <span style={{fontWeight:700, color:T.accent}}>{fmt(p.montant)}</span>
                                <span style={{color:T.text2, fontSize:13}}>{fmtDate(p.date)}</span>
                                <DarkBadge statut={p.statut}/>
                              </div>
                            );
                          })}
                        </div>
                        {payments.length===0 && (
                          <div style={S.emptyState}><CreditCard size={36} strokeWidth={1}/><p>Aucun paiement</p></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "notifs" && (
                <div style={{maxWidth:520, margin:"0 auto"}} className="fade-up">
                  <div style={{...S.notifCard, textAlign:"center"}}>
                    <div style={{...S.notifIconWrap, margin:"0 auto 18px"}}>
                      <Bell size={28} color={T.accent}/>
                    </div>
                    <h3 style={{fontSize:20, fontWeight:800, color:T.text0, margin:"0 0 8px"}}>
                      Rappels de paiement
                    </h3>
                    <p style={{color:T.text1, marginBottom:24, fontSize:14, lineHeight:1.6}}>
                      Notifier les locataires n'ayant pas encore payé pour{" "}
                      <strong style={{color:T.accent}}>{selMois}</strong>.
                    </p>
                    {tenants.filter(t => !(t.statut === "payé" && t.mois === selMois)).length===0 ? (
                      <div style={{padding:"20px 0", color:T.success, fontWeight:700}}>
                        <CheckCircle size={20} style={{verticalAlign:"middle", marginRight:6}}/>
                        Tous les locataires ont payé !
                      </div>
                    ) : (
                      <>
                        <div style={{marginBottom:20, textAlign:"left"}}>
                          {tenants.filter(t => !(t.statut === "payé" && t.mois === selMois)).map(t => (
                            <div key={t.id} style={S.notifRow}>
                              <div style={{display:"flex", alignItems:"center", gap:10}}>
                                <div style={S.avatar(32,9)}>{t.nom?.[0]}</div>
                                <div>
                                  <div style={{fontWeight:600, fontSize:14, color:T.text0}}>{t.nom}</div>
                                  <div style={{fontSize:12, color:T.text2}}>{t.logement}</div>
                                </div>
                              </div>
                              <DarkBadge statut={effectiveStatut(t)}/>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={async () => { try { const sendReminders = httpsCallable(functions, "sendManualReminders"); await sendReminders({ mois: selMois }); setNotifSent(true); setTimeout(() => setNotifSent(false), 4000); } catch (error) { console.error("Erreur d'envoi des rappels:", error); alert("Erreur lors de l'envoi des rappels: " + (error.message || error.code || "Erreur inconnue")); console.error("DÃ©tails erreur:", error); } }}
                          style={{...S.btnPrimary, width:"100%", justifyContent:"center", padding:"13px"}}>
                          <Send size={16}/> Envoyer les rappels
                        </button>
                        {notifSent && (
                          <div style={S.notifSuccess}>
                            <CheckCircle size={16}/> Rappels envoyés avec succès !
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

            </>
          )}
        </div>

        {isMobile && (
          <nav style={S.bottomNav}>
            {navItems.map(({key, Icon, label}) => (
              <button key={key} onClick={() => setTab(key)} style={S.bottomNavItem(tab===key)}>
                <Icon size={20} strokeWidth={tab===key ? 2.5 : 1.8}/>
                <span>{label}</span>
              </button>
            ))}
            <button onClick={onLogout} style={{
              ...S.bottomNavItem(false),
              color:T.danger, borderLeft:`1px solid ${T.border}`, flex:"0 0 64px",
            }}>
              <LogOut size={20} strokeWidth={1.8}/>
              <span>Sortir</span>
            </button>
          </nav>
        )}
      </main>

      {/* ══ MODAL ══ */}
      {modal?.type === "tenant" && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={{...S.modalCard, width: isMobile ? "calc(100% - 32px)" : 420}}
            onClick={e => e.stopPropagation()}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22}}>
              <h3 style={S.modalTitle}>{form.id ? "Modifier le locataire" : "Nouveau locataire"}</h3>
              <button onClick={closeModal}
                style={{background:"rgba(255,255,255,0.06)", border:`1px solid ${T.border}`, borderRadius:8, cursor:"pointer", padding:6, display:"flex"}}>
                <X size={18} color={T.text1}/>
              </button>
            </div>

            {formFields.map(f => {
              const isPassword = f.key === "password";
              const inputType  = isPassword ? (showPassword ? "text" : "password") : f.type;

              return (
                <div key={f.key} style={{marginBottom:14}}>
                  <label style={S.label}>{f.label}</label>
                  <div style={{position:"relative"}}>
                    {/* Icône gauche */}
                    <f.Icon size={14} style={{
                      position:"absolute", left:11, top:"50%",
                      transform:"translateY(-50%)",
                      color: focusedInput===f.key ? T.accent : T.text1,
                      pointerEvents:"none",
                      transition:"color .15s",
                    }}/>

                    <input
                      type={inputType}
                      placeholder={f.label}
                      value={form[f.key]||""}
                      onChange={e => setForm(p => ({...p, [f.key]: f.type==="number" ? +e.target.value : e.target.value}))}
                      style={{
                        ...S.modalInput,
                        // padding-right élargi pour le champ password (place pour l'icône eye)
                        paddingRight: isPassword ? 38 : 12,
                        ...(focusedInput===f.key
                          ? {borderColor:T.accent, boxShadow:`0 0 0 3px ${T.accentSoft}`}
                          : {}),
                      }}
                      onFocus={() => setFocusedInput(f.key)}
                      onBlur={() => setFocusedInput(null)}
                    />

                    {/* Bouton eye — uniquement pour le mot de passe */}
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        style={{
                          position:"absolute", right:10, top:"50%",
                          transform:"translateY(-50%)",
                          background:"none", border:"none", cursor:"pointer",
                          padding:2, display:"flex", alignItems:"center",
                          color: showPassword ? T.accent : T.text2,
                          transition:"color .15s",
                        }}
                        tabIndex={-1}
                        title={showPassword ? "Masquer" : "Afficher"}
                      >
                        {showPassword
                          ? <EyeOff size={15}/>
                          : <Eye    size={15}/>
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{display:"flex", gap:10, marginTop:24}}>
              <button onClick={closeModal} style={{...S.btnOutline, flex:1, justifyContent:"center"}}>Annuler</button>
              <button onClick={saveTenant} style={{...S.btnPrimary, flex:1, justifyContent:"center"}}>
                {form.id ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

