import { useState, useEffect, useCallback } from "react";
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, query, where
} from "firebase/firestore";
import {
  Zap, LayoutDashboard, Users, CreditCard, Bell, LogOut,
  CheckCircle, XCircle, DollarSign, Plus,
  Pencil, Trash2, Send, ShieldCheck, Home, Phone, Menu, X,
  Search, RefreshCw, User, AlertTriangle, ChevronRight, TrendingUp
} from "lucide-react";
import { db } from "../config/firebase";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt } from "../utils/helpers";

/* ─────────────────────────────────────────────
   STYLES LOCAUX (indépendants du thème global)
───────────────────────────────────────────── */
const A = {
  /* Layout */
  appWrap:  { display:"flex", minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f1f5f9" },
  sidebar:  {
    width:220, flexShrink:0, background:"#fff",
    borderRight:"1px solid #e2e8f0",
    display:"flex", flexDirection:"column",
    position:"sticky", top:0, height:"100vh", overflowY:"auto",
  },
  main: { flex:1, display:"flex", flexDirection:"column", minWidth:0, overflowX:"hidden" },

  /* Sidebar */
  sidebarTop: { padding:"22px 18px 14px", borderBottom:"1px solid #f1f5f9" },
  sidebarBrand: { display:"flex", alignItems:"center", gap:10 },
  sidebarIcon: {
    width:36, height:36, borderRadius:10,
    background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 12px rgba(99,102,241,0.35)",
  },
  sidebarName: { fontSize:16, fontWeight:900, color:"#0f172a", letterSpacing:-0.5 },
  sidebarSub:  { fontSize:10, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:.6 },
  sidebarSection: { fontSize:10, fontWeight:700, color:"#cbd5e1", letterSpacing:.8, textTransform:"uppercase", padding:"18px 18px 6px" },
  navItem: {
    display:"flex", alignItems:"center", gap:10,
    padding:"9px 14px", margin:"1px 8px", borderRadius:9,
    border:"none", background:"transparent",
    color:"#64748b", cursor:"pointer", fontSize:13.5, fontWeight:500,
    textAlign:"left", width:"calc(100% - 16px)", transition:"all .15s",
  },
  navItemActive: { background:"#eef2ff", color:"#4f46e5", fontWeight:700 },
  navBadge: {
    background:"#fee2e2", color:"#b91c1c",
    fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:20, marginLeft:"auto",
  },
  sidebarFooter: { padding:"14px 12px", borderTop:"1px solid #f1f5f9", marginTop:"auto" },
  userBlock: {
    display:"flex", alignItems:"center", gap:10,
    padding:"10px 12px", borderRadius:10,
    background:"#f8fafc", marginBottom:8,
  },
  userAvatar: {
    width:34, height:34, borderRadius:9, flexShrink:0,
    background:"linear-gradient(135deg,#f59e0b,#d97706)",
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  logoutBtn: {
    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
    width:"100%", padding:"9px 0", borderRadius:9,
    border:"1px solid #fee2e2", background:"#fff5f5",
    color:"#ef4444", fontSize:13, fontWeight:600, cursor:"pointer",
  },

  /* Header */
  header: {
    padding:"16px 28px", background:"#fff",
    borderBottom:"1px solid #e2e8f0",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:50,
  },
  pageTitle: { margin:0, fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:-0.5 },
  pageSub:   { margin:"2px 0 0", fontSize:12, color:"#94a3b8" },
  headerRight: { display:"flex", alignItems:"center", gap:8 },
  refreshBtn: {
    display:"flex", alignItems:"center", gap:6,
    padding:"8px 14px", borderRadius:9,
    border:"1px solid #e2e8f0", background:"#fff",
    color:"#64748b", fontSize:13, fontWeight:600, cursor:"pointer",
  },
  adminPill: {
    display:"flex", alignItems:"center", gap:6,
    padding:"7px 14px", borderRadius:20,
    background:"#ede9fe", color:"#5b21b6", fontSize:12, fontWeight:700,
  },

  /* Content */
  content: { flex:1, padding:"24px 28px" },

  /* ── STATS GRID ── 4 colonnes sur desktop */
  statsRow: {
    display:"grid",
    gridTemplateColumns:"repeat(4, 1fr)",
    gap:16, marginBottom:20,
  },
  statCard: {
    background:"#fff", borderRadius:14,
    padding:"18px 20px",
    boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
    border:"1px solid #f1f5f9",
    display:"flex", flexDirection:"column", gap:10,
  },
  statCardTop: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  statIconWrap: { width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" },
  statVal:   { fontSize:28, fontWeight:900, lineHeight:1, letterSpacing:-1 },
  statLabel: { fontSize:12, color:"#94a3b8", fontWeight:500, marginTop:2 },

  /* ── SECTION ROW (progress + alertes) ── */
  sectionRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 },
  sectionCard: {
    background:"#fff", borderRadius:14, padding:"20px 22px",
    boxShadow:"0 1px 3px rgba(0,0,0,0.06)", border:"1px solid #f1f5f9",
  },

  /* Progress bar */
  progressWrap: { height:8, borderRadius:99, background:"#e2e8f0", overflow:"hidden", margin:"10px 0 8px" },

  /* Table card */
  tableCard: {
    background:"#fff", borderRadius:14, overflow:"hidden",
    boxShadow:"0 1px 3px rgba(0,0,0,0.06)", border:"1px solid #f1f5f9",
    marginBottom:20,
  },
  tableHeader: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"16px 20px", borderBottom:"1px solid #f8fafc",
  },
  tableTitle: { margin:0, fontSize:15, fontWeight:700, color:"#0f172a" },
  tableHead: {
    display:"grid", background:"#f8fafc",
    padding:"10px 20px", gap:10,
    fontSize:11, fontWeight:700, color:"#94a3b8",
    letterSpacing:.6, textTransform:"uppercase",
  },
  tableRow: {
    display:"grid", padding:"13px 20px", gap:10,
    borderTop:"1px solid #f8fafc", fontSize:13.5,
    alignItems:"center",
  },

  /* Buttons */
  btnPrimary: {
    display:"inline-flex", alignItems:"center", gap:7,
    padding:"9px 18px", borderRadius:9, border:"none",
    background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
    color:"#fff", fontWeight:700, fontSize:13.5, cursor:"pointer",
    boxShadow:"0 2px 8px rgba(99,102,241,0.3)",
  },
  btnSmallGreen: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"6px 12px", borderRadius:7, border:"none",
    background:"#dcfce7", color:"#15803d", fontWeight:700, fontSize:12, cursor:"pointer",
  },
  btnSmallBlue: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"6px 12px", borderRadius:7, border:"none",
    background:"#eef2ff", color:"#4f46e5", fontWeight:700, fontSize:12, cursor:"pointer",
  },
  btnSmallRed: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"6px 12px", borderRadius:7, border:"none",
    background:"#fee2e2", color:"#b91c1c", fontWeight:700, fontSize:12, cursor:"pointer",
  },
  btnSmallGray: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"7px 13px", borderRadius:8, border:"1px solid #e2e8f0",
    background:"#fff", color:"#64748b", fontWeight:600, fontSize:13, cursor:"pointer",
  },
  btnOutline: {
    display:"inline-flex", alignItems:"center", gap:7,
    padding:"9px 18px", borderRadius:9,
    border:"1.5px solid #e2e8f0", background:"#fff",
    color:"#64748b", fontWeight:600, fontSize:13.5, cursor:"pointer",
  },
  btnViewAll: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"7px 14px", borderRadius:8,
    border:"1px solid #e2e8f0", background:"#f8fafc",
    color:"#4f46e5", fontWeight:700, fontSize:12.5, cursor:"pointer",
  },

  /* Avatar */
  avatar: {
    width:32, height:32, borderRadius:9,
    background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#fff", fontWeight:800, fontSize:13, flexShrink:0,
  },

  /* Search */
  searchWrap: { position:"relative" },
  searchIcon: { position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" },
  searchInput: {
    padding:"9px 12px 9px 34px", borderRadius:9,
    border:"1.5px solid #e2e8f0", background:"#f8fafc",
    fontSize:13.5, color:"#0f172a", outline:"none",
    transition:"border-color .2s",
  },

  /* Modal */
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 },
  modalCard: {
    background:"#fff", borderRadius:18, padding:"28px 30px",
    width:420, boxShadow:"0 24px 60px rgba(0,0,0,0.15)",
    maxHeight:"90vh", overflowY:"auto",
  },
  modalTitle: { margin:0, fontSize:18, fontWeight:800, color:"#0f172a" },
  label: { display:"block", fontSize:11.5, fontWeight:700, color:"#64748b", marginBottom:6, textTransform:"uppercase", letterSpacing:.5 },
  modalInput: {
    width:"100%", padding:"10px 12px 10px 38px",
    borderRadius:9, border:"1.5px solid #e2e8f0",
    fontSize:13.5, color:"#0f172a", outline:"none",
    boxSizing:"border-box", background:"#f8fafc",
    transition:"border-color .15s",
  },

  /* Notif */
  notifCard: { background:"#fff", borderRadius:16, padding:"28px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)", border:"1px solid #f1f5f9" },
  notifIconWrap: { width:60, height:60, borderRadius:16, background:"#eef2ff", border:"1px solid #e0e7ff", display:"flex", alignItems:"center", justifyContent:"center" },
  notifRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:"#f8fafc", borderRadius:10, marginBottom:8 },
  notifSuccess: { display:"flex", alignItems:"center", gap:8, background:"#dcfce7", color:"#15803d", borderRadius:10, padding:"12px 16px", fontWeight:600, fontSize:13, marginTop:12 },

  /* Alert */
  alertWarn: { display:"flex", alignItems:"flex-start", gap:10, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 16px", marginBottom:16 },

  /* Empty */
  emptyState: { display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 0", color:"#94a3b8", gap:8 },

  /* Mobile cards */
  mobCard: { background:"#fff", borderRadius:12, padding:"14px 16px", marginBottom:10, boxShadow:"0 1px 3px rgba(0,0,0,0.06)", border:"1px solid #f1f5f9" },
  mobRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid #f8fafc" },
  mobLabel: { fontSize:11.5, color:"#94a3b8", fontWeight:600 },
  mobVal: { fontSize:13, color:"#334155", fontWeight:500 },
};

export default function AdminDashboard({ onLogout }) {
  const [tenants, setTenants]       = useState([]);
  const [payments, setPayments]     = useState([]);
  const [tab, setTab]               = useState("dashboard");
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({});
  const [loading, setLoading]       = useState(true);
  const [notifSent, setNotifSent]   = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [isMobile, setIsMobile]     = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => { setIsMobile(window.innerWidth <= 768); if (window.innerWidth > 768) setIsMenuOpen(false); };
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
      setTenants(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const stats = {
    total:    tenants.length,
    payes:    tenants.filter(t => t.statut === "payé").length,
    nonPayes: tenants.filter(t => t.statut === "non payé").length,
    retards:  tenants.filter(t => t.statut === "retard").length,
    revenus:  payments.filter(p => p.mois === CURRENT_MONTH).reduce((a, p) => a + (p.montant || 0), 0),
    taux:     tenants.length ? Math.round((tenants.filter(t => t.statut === "payé").length / tenants.length) * 100) : 0,
  };

  const filteredTenants = tenants.filter(t =>
    t.nom?.toLowerCase().includes(search.toLowerCase()) ||
    t.logement?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal  = (type, data = {}) => { setModal({ type }); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveTenant = async () => {
    if (!form.nom || !form.logement || !form.montant) return;
    try {
      if (form.id) { const { id, ...data } = form; await updateDoc(doc(db, "clients", id), data); }
      else await addDoc(collection(db, "clients"), { ...form, statut:"non payé", datePaiement:null, mois:CURRENT_MONTH });
      await loadAll();
    } catch (e) { console.error(e); }
    closeModal();
  };

  const deleteTenant = async (id) => {
    if (!window.confirm("Supprimer ce locataire ?")) return;
    try {
      await deleteDoc(doc(db, "clients", id));
      const snap = await getDocs(query(collection(db, "paiements"), where("clientId","==",id)));
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
      await loadAll();
    } catch (e) { console.error(e); }
  };

  const markPaid = async (tenantId) => {
    const today  = new Date().toISOString().split("T")[0];
    const tenant = tenants.find(t => t.id === tenantId);
    try {
      await updateDoc(doc(db, "clients", tenantId), { statut:"payé", datePaiement:today });
      if (tenant) await addDoc(collection(db, "paiements"), { clientId:tenantId, montant:tenant.montant, date:today, mois:CURRENT_MONTH, statut:"payé" });
      await loadAll();
    } catch (e) { console.error(e); }
  };

  const navItems = [
    { key:"dashboard", Icon:LayoutDashboard, label:"Tableau de bord" },
    { key:"tenants",   Icon:Users,           label:"Locataires" },
    { key:"payments",  Icon:CreditCard,      label:"Paiements" },
    { key:"notifs",    Icon:Bell,            label:"Notifications", badge: tenants.filter(t => t.statut !== "payé").length || null },
  ];

  /* ── Sidebar partagée ── */
  const SidebarInner = ({ onNav }) => (
    <>
      <div style={A.sidebarTop}>
        <div style={A.sidebarBrand}>
          <div style={A.sidebarIcon}><Zap size={20} color="#fff" strokeWidth={2.5}/></div>
          <div>
            <div style={A.sidebarName}>ElecPay</div>
            <div style={A.sidebarSub}>Électricité</div>
          </div>
        </div>
      </div>
      <div style={A.sidebarSection}>Menu</div>
      <nav style={{ flex:1 }}>
        {navItems.map(({ key, Icon, label, badge }) => (
          <button key={key} onClick={() => { setTab(key); onNav?.(); }}
            style={{ ...A.navItem, ...(tab===key ? A.navItemActive : {}) }}>
            <Icon size={16} strokeWidth={tab===key ? 2.5 : 2}/>
            <span style={{ flex:1 }}>{label}</span>
            {badge ? <span style={A.navBadge}>{badge}</span> : tab===key && <div style={{ width:6, height:6, borderRadius:"50%", background:"#4f46e5", marginLeft:"auto" }}/>}
          </button>
        ))}
      </nav>
      <div style={A.sidebarFooter}>
        <div style={A.userBlock}>
          <div style={A.userAvatar}><ShieldCheck size={16} color="#fff"/></div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>Administrateur</div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>Accès complet</div>
          </div>
        </div>
        <button onClick={onLogout} style={A.logoutBtn}><LogOut size={14}/> Déconnexion</button>
      </div>
    </>
  );

  /* ── Cartes mobile ── */
  const TenantRowCard = ({ t }) => (
    <div style={A.mobCard}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={A.avatar}>{t.nom?.[0]}</div>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{t.nom}</div><div style={{ fontSize:12, color:"#64748b" }}>{t.logement}</div></div>
        <Badge statut={t.statut}/>
      </div>
      <div style={A.mobRow}><span style={A.mobLabel}>Montant</span><span style={{ ...A.mobVal, fontWeight:700 }}>{fmt(t.montant)}</span></div>
      <div style={{ ...A.mobRow, border:"none" }}><span style={A.mobLabel}>Date paiement</span><span style={{ ...A.mobVal, color:"#64748b" }}>{t.datePaiement || "—"}</span></div>
      {t.statut !== "payé" && (
        <button onClick={() => markPaid(t.id)} style={{ ...A.btnSmallGreen, marginTop:10, width:"100%", justifyContent:"center", padding:"9px" }}>
          <CheckCircle size={14}/> Encaisser
        </button>
      )}
    </div>
  );

  const TenantManageCard = ({ t }) => (
    <div style={A.mobCard}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={A.avatar}>{t.nom?.[0]}</div>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{t.nom}</div><div style={{ fontSize:12, color:"#64748b" }}>{t.logement} · {t.telephone || "—"}</div></div>
        <Badge statut={t.statut}/>
      </div>
      <div style={A.mobRow}><span style={A.mobLabel}>Montant</span><span style={{ ...A.mobVal, fontWeight:700 }}>{fmt(t.montant)}</span></div>
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        {t.statut !== "payé" && <button onClick={() => markPaid(t.id)} style={{ ...A.btnSmallGreen, flex:1, justifyContent:"center" }}><CheckCircle size={12}/> Encaisser</button>}
        <button onClick={() => openModal("tenant", { ...t })} style={{ ...A.btnSmallBlue, flex:1, justifyContent:"center" }}><Pencil size={12}/> Modifier</button>
        <button onClick={() => deleteTenant(t.id)} style={{ ...A.btnSmallRed, flex:1, justifyContent:"center" }}><Trash2 size={12}/> Suppr.</button>
      </div>
    </div>
  );

  const PaymentCard = ({ p }) => {
    const t = tenants.find(x => x.id === p.clientId);
    return (
      <div style={A.mobCard}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={A.avatar}>{t?.nom?.[0] || "?"}</div>
          <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{t?.nom || "—"}</div><div style={{ fontSize:12, color:"#64748b" }}>{p.mois}</div></div>
          <Badge statut={p.statut}/>
        </div>
        <div style={A.mobRow}><span style={A.mobLabel}>Montant</span><span style={{ ...A.mobVal, fontWeight:700 }}>{fmt(p.montant)}</span></div>
        <div style={{ ...A.mobRow, border:"none" }}><span style={A.mobLabel}>Date</span><span style={{ ...A.mobVal, color:"#64748b" }}>{p.date}</span></div>
      </div>
    );
  };

  const currentNav = navItems.find(n => n.key === tab);

  return (
    <div style={A.appWrap}>

      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <aside style={A.sidebar}>
          <SidebarInner />
        </aside>
      )}

      {/* ── Mobile Sidebar overlay ── */}
      {isMobile && isMenuOpen && (
        <div style={A.overlay} onClick={() => setIsMenuOpen(false)}>
          <div style={{ position:"fixed", left:0, top:0, height:"100vh", width:250, background:"#fff", display:"flex", flexDirection:"column", boxShadow:"4px 0 24px rgba(0,0,0,0.1)", zIndex:300 }}
            onClick={e => e.stopPropagation()}>
            <SidebarInner onNav={() => setIsMenuOpen(false)}/>
          </div>
        </div>
      )}

      <main style={A.main}>

        {/* ── Header ── */}
        <header style={{ ...A.header, padding: isMobile ? "14px 16px" : "16px 28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isMobile && (
              <button onClick={() => setIsMenuOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}>
                <Menu size={22} color="#0f172a"/>
              </button>
            )}
            <div>
              <h2 style={{ ...A.pageTitle, fontSize: isMobile ? 17 : 22 }}>{currentNav?.label}</h2>
              <p style={A.pageSub}>{CURRENT_MONTH}</p>
            </div>
          </div>
          <div style={A.headerRight}>
            <button onClick={loadAll} style={A.refreshBtn}>
              <RefreshCw size={14}/>{!isMobile && " Actualiser"}
            </button>
            {!isMobile && <div style={A.adminPill}><ShieldCheck size={13}/> Admin</div>}
          </div>
        </header>

        {/* ── Content ── */}
        <div style={{ ...A.content, padding: isMobile ? "16px" : "24px 28px" }}>
          {loading ? <Spinner/> : (
            <>

              {/* ══════════ DASHBOARD ══════════ */}
              {tab === "dashboard" && (
                <div>

                  {/* ── 4 stat cards en ligne ── */}
                  <div style={{ ...A.statsRow, gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16 }}>
                    {[
                      { label:"Total locataires", val:stats.total,         color:"#4f46e5", bg:"#eef2ff", Icon:Users },
                      { label:"Ont payé",          val:stats.payes,        color:"#15803d", bg:"#dcfce7", Icon:CheckCircle, badge:`${stats.taux}%` },
                      { label:"En attente",        val:stats.nonPayes,     color:"#b91c1c", bg:"#fee2e2", Icon:XCircle },
                      { label:"Revenus du mois",   val:fmt(stats.revenus), color:"#0369a1", bg:"#e0f2fe", Icon:DollarSign },
                    ].map(({ label, val, color, bg, Icon, badge }) => (
                      <div key={label} style={{ ...A.statCard, borderTop:`3px solid ${color}` }}>
                        <div style={A.statCardTop}>
                          <div style={{ ...A.statIconWrap, background:bg }}>
                            <Icon size={20} color={color} strokeWidth={2}/>
                          </div>
                          {badge && <span style={{ fontSize:11, fontWeight:800, color, background:bg, padding:"3px 9px", borderRadius:20 }}>{badge}</span>}
                        </div>
                        <div>
                          <div style={{ ...A.statVal, color, fontSize: isMobile ? 22 : 28 }}>{val}</div>
                          <div style={A.statLabel}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Progress + Alertes ── */}
                  <div style={{ ...A.sectionRow, gridTemplateColumns: isMobile ? "1fr" : (stats.nonPayes > 0 ? "1fr 1fr" : "1fr") }}>
                    <div style={A.sectionCard}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>Taux de paiement</span>
                        <span style={{ fontWeight:800, fontSize:20, color:"#4f46e5" }}>{stats.taux}%</span>
                      </div>
                      <div style={A.progressWrap}>
                        <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#4f46e5,#7c3aed)", width:`${stats.taux}%`, transition:"width .6s ease" }}/>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#94a3b8" }}>
                        <span>{stats.payes} payé{stats.payes > 1 ? "s" : ""}</span>
                        <span>{stats.total - stats.payes} restant{stats.total - stats.payes > 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {stats.nonPayes > 0 && (
                      <div style={{ ...A.sectionCard, borderLeft:"3px solid #f59e0b", background:"#fffbeb" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                          <AlertTriangle size={15} color="#b45309"/>
                          <span style={{ fontSize:13, fontWeight:700, color:"#92400e" }}>Alertes ({stats.nonPayes})</span>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:110, overflowY:"auto" }}>
                          {tenants.filter(t => t.statut !== "payé").slice(0,5).map(t => (
                            <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
                              <span style={{ fontWeight:600, color:"#78350f" }}>{t.nom}</span>
                              <Badge statut={t.statut}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Tableau résumé ── */}
                  <div style={A.tableCard}>
                    <div style={A.tableHeader}>
                      <h3 style={A.tableTitle}>Paiements — {CURRENT_MONTH}</h3>
                      <button onClick={() => setTab("tenants")} style={A.btnViewAll}>
                        Voir tout <ChevronRight size={13}/>
                      </button>
                    </div>
                    {isMobile ? (
                      <div style={{ padding:12 }}>
                        {tenants.slice(0,5).map(t => <TenantRowCard key={t.id} t={t}/>)}
                      </div>
                    ) : (
                      <div style={{ overflowX:"auto" }}>
                        <div style={{ minWidth:640 }}>
                          <div style={{ ...A.tableHead, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr" }}>
                            <span>Locataire</span><span>Logement</span><span>Montant</span><span>Statut</span><span>Actions</span>
                          </div>
                          {tenants.slice(0,5).map(t => (
                            <div key={t.id} style={{ ...A.tableRow, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr" }}
                              onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                              onMouseLeave={e => e.currentTarget.style.background=""}>
                              <span style={{ display:"flex", alignItems:"center", gap:10, fontWeight:600 }}>
                                <div style={A.avatar}>{t.nom?.[0]}</div>{t.nom}
                              </span>
                              <span style={{ color:"#64748b" }}>{t.logement}</span>
                              <span style={{ fontWeight:700 }}>{fmt(t.montant)}</span>
                              <Badge statut={t.statut}/>
                              <span>
                                {t.statut !== "payé"
                                  ? <button onClick={() => markPaid(t.id)} style={A.btnSmallGreen}><CheckCircle size={13}/> Encaisser</button>
                                  : <span style={{ fontSize:12, color:"#15803d", fontWeight:600 }}>✓ {t.datePaiement}</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ LOCATAIRES ══════════ */}
              {tab === "tenants" && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
                    <div style={{ ...A.searchWrap, flex: isMobile ? 1 : undefined }}>
                      <Search size={14} style={A.searchIcon}/>
                      <input className="search-input" placeholder="Rechercher…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...A.searchInput, width: isMobile ? "100%" : 220, boxSizing:"border-box" }}/>
                    </div>
                    <button onClick={() => openModal("tenant")} style={A.btnPrimary}>
                      <Plus size={15}/> {isMobile ? "Ajouter" : "Nouveau locataire"}
                    </button>
                  </div>
                  <div style={A.tableCard}>
                    <div style={A.tableHeader}>
                      <h3 style={A.tableTitle}>Locataires <span style={{ fontWeight:400, color:"#94a3b8" }}>({filteredTenants.length})</span></h3>
                    </div>
                    {isMobile ? (
                      <div style={{ padding:12 }}>
                        {filteredTenants.map(t => <TenantManageCard key={t.id} t={t}/>)}
                        {filteredTenants.length === 0 && <div style={A.emptyState}><Users size={36} strokeWidth={1}/><p>Aucun locataire trouvé</p></div>}
                      </div>
                    ) : (
                      <div style={{ overflowX:"auto" }}>
                        <div style={{ minWidth:750 }}>
                          <div style={{ ...A.tableHead, gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 1fr 1.8fr" }}>
                            <span>Nom</span><span>Logement</span><span>Téléphone</span><span>Montant</span><span>Statut</span><span>Actions</span>
                          </div>
                          {filteredTenants.map(t => (
                            <div key={t.id} style={{ ...A.tableRow, gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 1fr 1.8fr" }}
                              onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                              onMouseLeave={e => e.currentTarget.style.background=""}>
                              <span style={{ display:"flex", alignItems:"center", gap:10, fontWeight:600 }}>
                                <div style={A.avatar}>{t.nom?.[0]}</div>{t.nom}
                              </span>
                              <span style={{ color:"#64748b" }}>{t.logement}</span>
                              <span style={{ color:"#64748b", fontSize:13 }}>{t.telephone || "—"}</span>
                              <span style={{ fontWeight:700 }}>{fmt(t.montant)}</span>
                              <Badge statut={t.statut}/>
                              <div style={{ display:"flex", gap:6 }}>
                                {t.statut !== "payé" && <button onClick={() => markPaid(t.id)} style={A.btnSmallGreen}><CheckCircle size={12}/></button>}
                                <button onClick={() => openModal("tenant", { ...t })} style={A.btnSmallBlue}><Pencil size={12}/> Modifier</button>
                                <button onClick={() => deleteTenant(t.id)} style={A.btnSmallRed}><Trash2 size={12}/> Suppr.</button>
                              </div>
                            </div>
                          ))}
                          {filteredTenants.length === 0 && <div style={A.emptyState}><Users size={36} strokeWidth={1}/><p>Aucun locataire trouvé</p></div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ PAIEMENTS ══════════ */}
              {tab === "payments" && (
                <div style={A.tableCard}>
                  <div style={A.tableHeader}>
                    <h3 style={A.tableTitle}>Historique des transactions</h3>
                    <span style={{ fontSize:13, color:"#94a3b8" }}>{payments.length} entrées</span>
                  </div>
                  {isMobile ? (
                    <div style={{ padding:12 }}>
                      {[...payments].reverse().map(p => <PaymentCard key={p.id} p={p}/>)}
                      {payments.length === 0 && <div style={A.emptyState}><CreditCard size={36} strokeWidth={1}/><p>Aucun paiement</p></div>}
                    </div>
                  ) : (
                    <div style={{ overflowX:"auto" }}>
                      <div style={{ minWidth:600 }}>
                        <div style={{ ...A.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr" }}>
                          <span>Locataire</span><span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                        </div>
                        {[...payments].reverse().map(p => {
                          const t = tenants.find(x => x.id === p.clientId);
                          return (
                            <div key={p.id} style={{ ...A.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr" }}
                              onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                              onMouseLeave={e => e.currentTarget.style.background=""}>
                              <span style={{ display:"flex", alignItems:"center", gap:10, fontWeight:600 }}>
                                <div style={A.avatar}>{t?.nom?.[0] || "?"}</div>{t?.nom || "—"}
                              </span>
                              <span style={{ color:"#64748b" }}>{p.mois}</span>
                              <span style={{ fontWeight:700 }}>{fmt(p.montant)}</span>
                              <span style={{ color:"#64748b", fontSize:13 }}>{p.date}</span>
                              <Badge statut={p.statut}/>
                            </div>
                          );
                        })}
                        {payments.length === 0 && <div style={A.emptyState}><CreditCard size={36} strokeWidth={1}/><p>Aucun paiement</p></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ NOTIFICATIONS ══════════ */}
              {tab === "notifs" && (
                <div style={{ maxWidth:520, margin:"0 auto" }}>
                  <div style={{ ...A.notifCard, textAlign:"center" }}>
                    <div style={{ ...A.notifIconWrap, margin:"0 auto 18px" }}>
                      <Bell size={28} color="#4f46e5"/>
                    </div>
                    <h3 style={{ fontSize:20, fontWeight:800, color:"#0f172a", margin:"0 0 8px" }}>Rappels de paiement</h3>
                    <p style={{ color:"#64748b", marginBottom:24, fontSize:14, lineHeight:1.6 }}>
                      Notifier les locataires n'ayant pas encore payé pour <strong style={{ color:"#0f172a" }}>{CURRENT_MONTH}</strong>.
                    </p>
                    {tenants.filter(t => t.statut !== "payé").length === 0 ? (
                      <div style={{ padding:"20px 0", color:"#15803d", fontWeight:700 }}>
                        <CheckCircle size={20} style={{ verticalAlign:"middle", marginRight:6 }}/>
                        Tous les locataires ont payé !
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom:20, textAlign:"left" }}>
                          {tenants.filter(t => t.statut !== "payé").map(t => (
                            <div key={t.id} style={A.notifRow}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={A.avatar}>{t.nom?.[0]}</div>
                                <div><div style={{ fontWeight:600, fontSize:14 }}>{t.nom}</div><div style={{ fontSize:12, color:"#94a3b8" }}>{t.logement}</div></div>
                              </div>
                              <Badge statut={t.statut}/>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setNotifSent(true); setTimeout(() => setNotifSent(false), 4000); }}
                          style={{ ...A.btnPrimary, width:"100%", justifyContent:"center", padding:"13px" }}>
                          <Send size={16}/> Envoyer les rappels
                        </button>
                        {notifSent && (
                          <div style={A.notifSuccess}>
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
      </main>

      {/* ══════════ MODAL ══════════ */}
      {modal?.type === "tenant" && (
        <div style={A.overlay} onClick={closeModal}>
          <div style={{ ...A.modalCard, width: isMobile ? "calc(100% - 32px)" : 420 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <h3 style={A.modalTitle}>{form.id ? "Modifier le locataire" : "Nouveau locataire"}</h3>
              <button onClick={closeModal} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", padding:6, display:"flex" }}>
                <X size={18} color="#64748b"/>
              </button>
            </div>
            {[
              { key:"nom",       label:"Nom complet",          Icon:User,       type:"text"   },
              { key:"logement",  label:"N° de logement",       Icon:Home,       type:"text"   },
              { key:"telephone", label:"Téléphone",            Icon:Phone,      type:"text"   },
              { key:"montant",   label:"Montant mensuel (Ar)", Icon:DollarSign, type:"number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={A.label}>{f.label}</label>
                <div style={{ position:"relative" }}>
                  <f.Icon size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }}/>
                  <input type={f.type} placeholder={f.label} value={form[f.key] || ""}
                    onChange={e => setForm(p => ({ ...p, [f.key]: f.type==="number" ? +e.target.value : e.target.value }))}
                    style={A.modalInput}
                    onFocus={e => e.target.style.borderColor="#4f46e5"}
                    onBlur={e => e.target.style.borderColor="#e2e8f0"}/>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={closeModal} style={{ ...A.btnOutline, flex:1, justifyContent:"center" }}>Annuler</button>
              <button onClick={saveTenant} style={{ ...A.btnPrimary, flex:1, justifyContent:"center" }}>
                {form.id ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}