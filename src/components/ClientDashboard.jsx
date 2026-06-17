import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Zap, User, LogOut, History, Building2, Phone,
  Calendar, DollarSign, Home, AlertTriangle, ShieldCheck,
  Menu, CheckCircle, X
} from "lucide-react";
import { db } from "../config/firebase";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt, getRecentMonths } from "../utils/helpers";

/* ————————————————————————————————————————
   DARK THEME TOKENS
———————————————————————————————————————— */
const T = {
  bg0:    "#07080d",
  bg1:    "#0d0f1a",
  bg2:    "#12152a",
  bg3:    "#1a1f38",
  bg4:    "#222848",
  border: "rgba(99,120,255,0.12)",
  borderHover: "rgba(99,120,255,0.28)",
  accent: "#5b6ef5",
  accentGlow: "rgba(91,110,245,0.35)",
  accentSoft: "rgba(91,110,245,0.12)",
  text0:  "#f0f2ff",
  text1:  "#9ba3c4",
  text2:  "#5c6380",
  success:"#3ecf8e",
  successSoft: "rgba(62,207,142,0.12)",
  danger: "#f87171",
  dangerSoft: "rgba(248,113,113,0.12)",
  warn:   "#fbbf24",
  warnSoft: "rgba(251,191,36,0.1)",
};

/* ————————————————————————————————————————
   STYLES
———————————————————————————————————————— */
const S = {
  appWrap: {
    display: "flex", minHeight: "100vh",
    background: T.bg0, fontFamily: "'DM Sans', system-ui, sans-serif",
    color: T.text0,
  },
  /* Sidebar */
  sidebar: {
    width: 240, flexShrink: 0,
    background: T.bg1,
    borderRight: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column",
    position: "fixed", top: 0, left: 0, height: "100vh",
    zIndex: 100,
  },
  sidebarLogo: {
    padding: "22px 20px 18px",
    display: "flex", alignItems: "center", gap: 11,
    borderBottom: `1px solid ${T.border}`,
  },
  logoIcon: {
    width: 34, height: 34, borderRadius: 9,
    background: T.accent,
    boxShadow: `0 0 16px ${T.accentGlow}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  logoText: { fontSize: 15, fontWeight: 700, color: T.text0, letterSpacing: "-0.3px" },
  logoSub:  { fontSize: 10, color: T.text2, letterSpacing: "0.06em", textTransform: "uppercase" },

  sidebarNav: {
    flex: 1, padding: "16px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2,
  },
  navSection: {
    fontSize: 10, fontWeight: 700, color: T.text2, letterSpacing: "0.1em",
    textTransform: "uppercase", padding: "8px 10px 6px",
  },
  navItem: (active) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
    background: active ? T.accentSoft : "transparent",
    color: active ? T.accent : T.text1,
    fontSize: 13, fontWeight: active ? 600 : 400,
    textAlign: "left",
    outline: "none",
    transition: "background 0.18s, color 0.18s",
    borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
  }),
  navDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: T.accent, marginLeft: "auto", flexShrink: 0,
    boxShadow: `0 0 6px ${T.accentGlow}`,
  },

  sidebarBottom: {
    padding: "12px 10px", borderTop: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column", gap: 8,
  },
  userCard: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 10,
    background: T.bg3, border: `1px solid ${T.border}`,
  },
  avatar: (size = 32, radius = 9) => ({
    width: size, height: size, borderRadius: radius,
    background: `linear-gradient(135deg, ${T.accent}, #8b5cf6)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0,
    letterSpacing: "-0.5px",
  }),
  logoutBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
    padding: "9px 12px", borderRadius: 9, border: `1px solid rgba(248,113,113,0.2)`,
    background: "rgba(248,113,113,0.06)", color: "#f87171",
    fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%",
    transition: "background 0.18s, border-color 0.18s",
    letterSpacing: "0.01em",
  },

  /* Main */
  main: {
    flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh",
  },
  header: {
    padding: "18px 28px",
    background: T.bg1, borderBottom: `1px solid ${T.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 10,
    backdropFilter: "blur(12px)",
  },
  pageTitle: { fontSize: 18, fontWeight: 700, color: T.text0, letterSpacing: "-0.4px" },
  monthSel: {
    border: "none", background: "transparent", cursor: "pointer",
    fontWeight: 600, color: T.accent, outline: "none", fontSize: 13,
    fontFamily: "inherit",
  },
  content: { flex: 1, padding: "24px 28px", overflowY: "auto" },

  /* Cards */
  card: {
    background: T.bg2,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardHeader: {
    padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: T.text0 },

  /* Profile hero */
  hero: {
    background: `linear-gradient(135deg, ${T.bg3} 0%, ${T.bg4} 100%)`,
    border: `1px solid ${T.border}`,
    borderRadius: 16, padding: "24px",
    display: "flex", alignItems: "center", gap: 20, marginBottom: 16,
    position: "relative", overflow: "hidden",
  },
  heroGlow: {
    position: "absolute", top: -40, right: -40, width: 200, height: 200,
    background: T.accentGlow, borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
  },

  /* Stats grid */
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16,
  },
  statCard: {
    background: T.bg2, border: `1px solid ${T.border}`,
    borderRadius: 13, padding: "16px",
    display: "flex", flexDirection: "column", gap: 8,
    transition: "border-color 0.2s, transform 0.2s",
    cursor: "default",
  },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 9,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  statLabel: { fontSize: 11, color: T.text2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" },

  /* Alert */
  alertWarn: {
    display: "flex", gap: 12, alignItems: "flex-start",
    padding: "14px 16px", borderRadius: 12,
    background: T.warnSoft, border: `1px solid rgba(251,191,36,0.2)`,
    marginTop: 4,
  },
  alertInfo: {
    display: "flex", gap: 10, alignItems: "center",
    padding: "11px 14px", borderRadius: 10,
    background: T.accentSoft, border: `1px solid ${T.border}`,
    marginBottom: 12, fontSize: 13,
  },

  /* Table */
  tableHead: {
    display: "grid", padding: "10px 20px",
    fontSize: 11, fontWeight: 700, color: T.text2,
    textTransform: "uppercase", letterSpacing: "0.08em",
    borderBottom: `1px solid ${T.border}`,
  },
  tableRow: {
    display: "grid", padding: "13px 20px",
    borderBottom: `1px solid rgba(99,120,255,0.06)`,
    fontSize: 13, alignItems: "center",
    transition: "background 0.15s",
    cursor: "default",
  },
  emptyState: {
    padding: "48px 20px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    color: T.text2,
  },

  /* Mobile card */
  mobCard: {
    background: T.bg2, borderRadius: 12,
    border: `1px solid ${T.border}`,
    padding: "14px 16px", marginBottom: 8,
    transition: "border-color 0.18s",
  },
  mobRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "5px 0", borderBottom: `1px solid rgba(99,120,255,0.06)`,
  },
  mobLabel: { fontSize: 11, color: T.text2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" },
  mobVal:   { fontSize: 13, fontWeight: 500, color: T.text0 },

  /* Status badge override */
  badge: (ok) => ({
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: ok ? T.successSoft : T.dangerSoft,
    color: ok ? T.success : T.danger,
    border: `1px solid ${ok ? "rgba(62,207,142,0.2)" : "rgba(248,113,113,0.2)"}`,
    letterSpacing: "0.04em",
  }),

  /* Mobile top bar */
  topbar: {
    padding: "14px 16px",
    background: T.bg1, borderBottom: `1px solid ${T.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 50,
  },

  /* Mobile bottom nav */
  bottomNav: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: T.bg1, borderTop: `1px solid ${T.border}`,
    display: "flex", alignItems: "stretch",
    zIndex: 100,
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },
  bottomNavItem: (active) => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 4, padding: "10px 0",
    background: "none", border: "none", cursor: "pointer",
    color: active ? T.accent : T.text2,
    fontSize: 10, fontWeight: active ? 700 : 500,
    transition: "color 0.18s",
  }),
};

/* ————————————————————————————————————————
   ANIMATIONS (injected once)
———————————————————————————————————————— */
const CSS_ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px rgba(91,110,245,0.3); }
    50%       { box-shadow: 0 0 20px rgba(91,110,245,0.55); }
  }

  .fade-up  { animation: fadeUp 0.32s ease both; }
  .fade-in  { animation: fadeIn 0.24s ease both; }
  .slide-left { animation: slideInLeft 0.28s ease both; }

  .stagger > * {
    animation: fadeUp 0.28s ease both;
  }
  .stagger > *:nth-child(1) { animation-delay: 0.04s; }
  .stagger > *:nth-child(2) { animation-delay: 0.08s; }
  .stagger > *:nth-child(3) { animation-delay: 0.12s; }
  .stagger > *:nth-child(4) { animation-delay: 0.16s; }

  .stat-card:hover {
    border-color: rgba(91,110,245,0.28) !important;
    transform: translateY(-2px) !important;
  }
  .nav-item:hover {
    background: rgba(91,110,245,0.08) !important;
    color: #a5b0ff !important;
  }
  .table-row:hover {
    background: rgba(91,110,245,0.05) !important;
  }
  .logout-btn:hover {
    background: rgba(248,113,113,0.12) !important;
    border-color: rgba(248,113,113,0.35) !important;
  }
  .mob-card:hover {
    border-color: rgba(91,110,245,0.28) !important;
  }
  .logo-icon {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(91,110,245,0.25); border-radius: 2px; }

  select option { background: #0d0f1a; color: #f0f2ff; }
`;

function DarkBadge({ statut }) {
  const ok = statut === "payé";
  return (
    <span style={S.badge(ok)}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ok ? T.success : T.danger }} />      
      {ok ? "Payé" : "En attente"}
    </span>
  );
}

export default function ClientDashboard({ user, onLogout }) {
  const [tenants,     setTenants]     = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [tab,         setTab]         = useState("profil");
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [loading,     setLoading]     = useState(true);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth <= 768);

  /* Resize listener */
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  /* Inject CSS */
  useEffect(() => {
    const id = "elecpay-dark-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS_ANIM;
      document.head.appendChild(s);
    }
  }, []);

  /* Data load */
  useEffect(() => {
    const load = async () => {
      try {
        const [tSnap, pSnap, monthSnap] = await Promise.all([
          getDocs(collection(db, "clients")),
          getDocs(query(collection(db, "paiements"), where("clientId", "==", user.tenant.id))),
          getDocs(query(collection(db, "paiements"), where("mois", "==", selectedMonth))),
        ]);
        setTenants(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAllPayments(monthSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [user.tenant.id, selectedMonth]);

  const processedTenants = tenants.map(t => ({
    ...t,
    statut: allPayments.some(p => p.clientId === t.id && p.mois === selectedMonth)
            ? "payé"
            : (t.statut === "payé" ? "non payé" : t.statut),
  }));
  const me     = processedTenants.find(t => t.id === user.tenant.id) || user.tenant;
  const isPaye = me.statut === "payé";

  /* LOGIQUE DE RAPPEL AUTOMATIQUE (Front-end) */
  useEffect(() => {
    if (!loading && !isPaye && selectedMonth === CURRENT_MONTH) {
      const day = new Date().getDate();
      if (day >= 15) {
        // Notification navigateur si possible
        if (Notification.permission === "granted") {
          new Notification("Rappel de paiement ElecPay", {
            body: `Nous sommes le ${day}, votre paiement pour ${selectedMonth} est toujours en attente.`,
            icon: "/favicon.ico"
          });
        }
      }
    }
  }, [loading, isPaye, selectedMonth]);

  const navItems = [
    { key: "profil",     Icon: User,      label: "Mon profil"  },
    { key: "historique", Icon: History,   label: "Historique"  },
    { key: "locataires", Icon: Building2, label: "Locataires"  },
  ];

  /* —— Sidebar shared content —— */
  const SidebarInner = () => (
    <>
      <div style={S.sidebarLogo}>
        <div style={S.logoIcon} className="logo-icon">
          <Zap size={17} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={S.logoText}>ElecPay</div>
          <div style={S.logoSub}>Électricité</div>
        </div>
      </div>
      <nav style={S.sidebarNav}>
        <div style={S.navSection}>Navigation</div>
        {navItems.map(({ key, Icon, label }) => (
          <button key={key} className="nav-item" onClick={() => { setTab(key); setMenuOpen(false); }} style={S.navItem(tab === key)}>
            <Icon size={16} strokeWidth={tab === key ? 2.5 : 1.8} />
            <span style={{ flex: 1 }}>{label}</span>
            {tab === key && <div style={S.navDot} />}
          </button>
        ))}
      </nav>
      <div style={S.sidebarBottom}>
        <div style={S.userCard}>
          <div style={S.avatar(32, 9)}>{me.nom?.[0]}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{me.nom?.split(" ")[0]}</div>
            <div style={{ fontSize: 11, color: T.text2 }}>{me.logement}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout} style={S.logoutBtn}><LogOut size={13} /> Déconnexion</button>
      </div>
    </>
  );

  const PaymentCard = ({ p }) => (
    <div className="mob-card fade-up" style={S.mobCard}>
      {[ ["Mois", p.mois, T.text0], ["Montant", fmt(p.montant), T.accent], ["Date", p.date, T.text1], ].map(([l, v, c]) => (
        <div key={l} style={S.mobRow}><span style={S.mobLabel}>{l}</span><span style={{ ...S.mobVal, color: c }}>{v}</span></div>
      ))}
      <div style={{ ...S.mobRow, borderBottom: "none" }}><span style={S.mobLabel}>Statut</span><DarkBadge statut={p.statut} /></div>
    </div>
  );

  const TenantCard = ({ t }) => (
    <div className="mob-card fade-up" style={{ ...S.mobCard, ...(t.id === me.id ? { borderColor: "rgba(91,110,245,0.4)", borderLeft: `3px solid ${T.accent}` } : {}) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={S.avatar(34, 9)}>{t.nom?.[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14, color: T.text0 }}>{t.nom}</div><div style={{ fontSize: 12, color: T.text2 }}>{t.logement}</div></div>
        {t.id === me.id && <span style={{ fontSize: 10, background: T.accentSoft, color: T.accent, padding: "2px 8px", borderRadius: 20, fontWeight: 800, border: `1px solid ${T.border}` }}>Moi</span>}
      </div>
      <div style={S.mobRow}><span style={S.mobLabel}>Mois</span><span style={{ ...S.mobVal, color: T.text1 }}>{selectedMonth}</span></div>
      <div style={{ ...S.mobRow, borderBottom: "none" }}><span style={S.mobLabel}>Statut</span><DarkBadge statut={t.statut} /></div>
    </div>
  );

  return (
    <div style={S.appWrap}>
      {!isMobile && <aside style={S.sidebar} className="slide-left"><SidebarInner /></aside>}
      {isMobile && menuOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 200, animation: "fadeIn 0.18s ease both" }} onClick={() => setMenuOpen(false)}><div style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: 260, background: T.bg1, display: "flex", flexDirection: "column", borderRight: `1px solid ${T.border}`, animation: "slideInLeft 0.22s ease both" }} onClick={e => e.stopPropagation()}><SidebarInner /></div></div>}
      <main style={{ ...S.main, marginLeft: isMobile ? 0 : 240 }}>
        <header style={{ ...S.header, padding: isMobile ? "13px 16px" : "18px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", color: T.text1 }}><Menu size={21} color={T.text0} /></button>}
            <div><h2 style={{ ...S.pageTitle, fontSize: isMobile ? 16 : 18 }}>{navItems.find(n => n.key === tab)?.label}</h2>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={S.monthSel}>{getRecentMonths().map(m => <option key={m} value={m}>{m}</option>)}</select>
            </div>
          </div>
          <DarkBadge statut={me.statut} />
        </header>
        <div style={{ ...S.content, padding: isMobile ? "16px 14px 90px" : "24px 28px" }}>
          {loading ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}><Spinner /></div> : (
            tab === "profil" ? (
              <div style={{ maxWidth: 820 }} className="fade-up">
                <div style={{ ...S.hero, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 14 : 20, padding: isMobile ? "18px 16px" : "24px" }}>
                  <div style={S.heroGlow} /><div style={{ ...S.avatar(isMobile ? 48 : 58, 14), boxShadow: `0 0 24px ${T.accentGlow}` }}>{me.nom?.[0]}</div>
                  <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}><h3 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 800, color: T.text0, margin: 0, letterSpacing: "-0.5px" }}>{me.nom}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, color: T.text1, marginTop: 6, fontSize: 13 }}><Home size={13} color={T.text2} /> {me.logement}{me.telephone && (<><span style={{ color: T.text2 }}>·</span><Phone size={13} color={T.text2} /> {me.telephone}</>)}</div>
                  </div>
                  <div style={{ padding: "12px 18px", borderRadius: 13, textAlign: "center", zIndex: 1, background: isPaye ? T.successSoft : T.dangerSoft, border: `1px solid ${isPaye ? "rgba(62,207,142,0.25)" : "rgba(248,113,113,0.25)"}`, alignSelf: isMobile ? "stretch" : undefined }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.text2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Statut</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: isPaye ? T.success : T.danger }}>{isPaye ? "✓ Payé" : "✕ En attente"}</div>
                  </div>
                </div>
                <div style={{ ...S.statsGrid, gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 10 : 12 }} className="stagger">
                  {[ { label: "Mois en cours", val: selectedMonth, Icon: Calendar, color: T.accent, bg: T.accentSoft }, { label: "Montant à payer", val: fmt(me.montant), Icon: DollarSign, color: T.success, bg: T.successSoft }, { label: "Dernier paiement", val: me.datePaiement || "—", Icon: CheckCircle, color: isPaye ? T.success : T.text2, bg: isPaye ? T.successSoft : `rgba(255,255,255,0.04)` }, { label: "Téléphone", val: me.telephone || "—", Icon: Phone, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" }, ].map(r => (
                    <div key={r.label} className="stat-card" style={{ ...S.statCard, padding: isMobile ? "14px" : "16px" }}>
                      <div style={{ ...S.statIconWrap, background: r.bg }}><r.Icon size={18} color={r.color} strokeWidth={2} /></div>
                      <div style={{ ...S.statValue, fontSize: isMobile ? 13 : 17, color: r.color, wordBreak: "break-word" }}>{r.val}</div>
                      <div style={S.statLabel}>{r.label}</div>
                    </div>
                  ))}
                </div>
                {!isPaye && (
                  <div style={S.alertWarn} className="fade-up">
                    <AlertTriangle size={20} color={T.warn} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div><div style={{ fontWeight: 700, color: T.warn, fontSize: 14, marginBottom: 3 }}>Paiement en attente</div>
                      <div style={{ color: "rgba(251,191,36,0.7)", fontSize: 13, lineHeight: 1.55 }}>Votre paiement d'électricité pour <strong style={{ color: T.warn }}>{selectedMonth}</strong> n'a pas encore été enregistré. Contactez votre gestionnaire.</div>
                    </div>
                  </div>
                )}
              </div>
            ) : tab === "historique" ? (
              <div style={{ maxWidth: 820 }} className="fade-up">
                <div style={S.card}><div style={S.cardHeader}><span style={S.cardTitle}>Mes paiements</span><span style={{ fontSize: 12, color: T.text2 }}>{payments.length} entrée{payments.length > 1 ? "s" : ""}</span></div>
                  {payments.length === 0 ? (
                    <div style={S.emptyState}><History size={40} strokeWidth={1} color={T.text2} /><p style={{ fontWeight: 600, color: T.text1, margin: 0 }}>Aucun paiement trouvé</p><p style={{ fontSize: 12, margin: 0 }}>Votre historique apparaîtra ici.</p></div>
                  ) : isMobile ? (
                    <div style={{ padding: "10px 12px" }}>{[...payments].reverse().map(p => <PaymentCard key={p.id} p={p} />)}</div>
                  ) : (
                    <div style={{ overflowX: "auto" }}><div style={{ minWidth: 500 }}><div style={{ ...S.tableHead, gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr" }}><span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span></div>
                        <div className="stagger">
                          {[...payments].reverse().map(p => (
                            <div key={p.id} className="table-row" style={{ ...S.tableRow, gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr" }}>
                              <span style={{ fontWeight: 600, color: T.text0 }}>{p.mois}</span>
                              <span style={{ fontWeight: 700, color: T.accent }}>{fmt(p.montant)}</span>        
                              <span style={{ color: T.text2, fontSize: 12 }}>{p.date}</span>
                              <DarkBadge statut={p.statut} />
                            </div>
                          ))}
                        </div>
                      </div></div>
                  )}
                </div>
              </div>
            ) : tab === "locataires" ? (
              <div style={{ maxWidth: 820 }} className="fade-up">
                <div style={S.alertInfo}><ShieldCheck size={15} color={T.accent} style={{ flexShrink: 0 }} /><span style={{ color: T.accent, fontWeight: 500, fontSize: 13 }}>Vue publique — Les informations sensibles sont protégées.</span></div>
                <div style={S.card}><div style={S.cardHeader}><span style={S.cardTitle}>Locataires — {selectedMonth}</span><span style={{ fontSize: 12, color: T.text2 }}>{processedTenants.length} locataires</span></div>
                  {isMobile ? ( <div style={{ padding: "10px 12px" }}>{processedTenants.map(t => <TenantCard key={t.id} t={t} />)}</div> ) : (
                    <div style={{ overflowX: "auto" }}><div style={{ minWidth: 500 }}><div style={{ ...S.tableHead, gridTemplateColumns: "2fr 1fr 1.5fr 1fr" }}><span>Locataire</span><span>Logement</span><span>Mois</span><span>Statut</span></div>
                        <div className="stagger">{processedTenants.map(t => (
                            <div key={t.id} className="table-row" style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1.5fr 1fr", ...(t.id === me.id ? { background: T.accentSoft, borderLeft: `3px solid ${T.accent}` } : {}) }}><span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: T.text0 }}><div style={S.avatar(30, 8)}>{t.nom?.[0]}</div>{t.nom}{t.id === me.id && <span style={{ fontSize: 10, background: T.accentSoft, color: T.accent, padding: "2px 8px", borderRadius: 20, fontWeight: 800, border: `1px solid ${T.border}` }}>Moi</span>}</span><span style={{ color: T.text2, fontSize: 13 }}>{t.logement}</span><span style={{ color: T.text2, fontSize: 12 }}>{selectedMonth}</span><DarkBadge statut={t.statut} /></div>
                          ))}</div>
                      </div></div>
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>
        {isMobile && (
          <nav style={S.bottomNav}>
            {navItems.map(({ key, Icon, label }) => ( <button key={key} onClick={() => setTab(key)} style={S.bottomNavItem(tab === key)}><Icon size={20} strokeWidth={tab === key ? 2.5 : 1.8} /><span>{label}</span></button> ))}
            <button onClick={onLogout} style={{ ...S.bottomNavItem(false), color: T.danger, borderLeft: `1px solid ${T.border}`, flex: "0 0 64px" }}><LogOut size={20} strokeWidth={1.8} /><span>Sortir</span></button>
          </nav>
        )}
      </main>
    </div>
  );
}
