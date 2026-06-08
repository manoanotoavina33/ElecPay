import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Zap, User, LogOut, History, Building2, Phone,
  Calendar, DollarSign, Home, AlertTriangle, ShieldCheck,
  Menu, CheckCircle
} from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt, getRecentMonths } from "../utils/helpers";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

export default function ClientDashboard({ user, onLogout }) {
  const [tenants,     setTenants]     = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [tab,         setTab]         = useState("profil");
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [loading,     setLoading]     = useState(true);
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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

  const navItems = [
    { key: "profil",     Icon: User,      label: "Mon profil"  },
    { key: "historique", Icon: History,   label: "Historique"  },
    { key: "locataires", Icon: Building2, label: "Locataires"  },
  ];

  /* ── Sidebar dark (mobile overlay) ── */
  const SidebarInner = () => (
    <>
      <div style={{ ...S.sidebarLogo, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={S.sidebarLogoIcon}><Zap size={20} color="#fff" strokeWidth={2.5}/></div>
        <div>
          <div style={{ ...S.sidebarLogoText, color:"#f8fafc" }}>ElecPay</div>
          <div style={{ ...S.sidebarLogoSub, color:"rgba(255,255,255,0.3)" }}>Électricité</div>
        </div>
      </div>
      <nav style={S.sidebarNav}>
        <div style={{ ...S.sidebarSection, color:"rgba(255,255,255,0.25)" }}>Navigation</div>
        {navItems.map(({ key, Icon, label }) => (
          <button key={key}
            onClick={() => { setTab(key); setIsMenuOpen(false); }}
            style={{
              ...S.navItem,
              color: tab === key ? "#fff" : "rgba(255,255,255,0.45)",
              ...(tab === key ? { background:"rgba(255,255,255,0.1)" } : {}),
            }}>
            <Icon size={17} strokeWidth={tab === key ? 2.5 : 2}/>
            <span style={{ flex:1 }}>{label}</span>
            {tab === key && <div style={{ ...S.navDot, background:"#818cf8" }}/>}
          </button>
        ))}
      </nav>
      <div style={{ ...S.sidebarFooter, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ ...S.userCard, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={S.avatar}>{me.nom?.[0]}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#f8fafc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {me.nom?.split(" ")[0]}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{me.logement}</div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{ ...S.logoutBtn, border:"1px solid rgba(255,68,68,0.25)", color:"rgba(252,165,165,1)" }}>
          <LogOut size={15}/> Déconnexion
        </button>
      </div>
    </>
  );

  /* ── Card mobile paiement ── */
  const PaymentCard = ({ p }) => (
    <div style={mob.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{p.mois}</span>
        <Badge statut={p.statut}/>
      </div>
      <div style={mob.row}><span style={mob.label}>Montant</span><span style={{ ...mob.val, fontWeight:700, color:"#4f46e5" }}>{fmt(p.montant)}</span></div>
      <div style={{ ...mob.row, border:"none" }}><span style={mob.label}>Date</span><span style={{ ...mob.val, color:"#64748b" }}>{fmtDate(p.date)}</span></div>
    </div>
  );

  /* ── Card mobile locataire ── */
  const TenantCard = ({ t }) => (
    <div style={{
      ...mob.card,
      ...(t.id === me.id ? { borderLeft:"3px solid #6366f1", background:"rgba(99,102,241,0.04)" } : {}),
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ ...S.avatar, width:36, height:36, borderRadius:10, fontSize:14, flexShrink:0 }}>
          {t.nom?.[0]}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, color:"#0f172a", fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
            {t.nom}
            {t.id === me.id && (
              <span style={{ fontSize:9, background:"#6366f1", color:"#fff", padding:"2px 7px", borderRadius:20, fontWeight:800 }}>MOI</span>
            )}
          </div>
          <div style={{ fontSize:12, color:"#64748b" }}>{t.logement}</div>
        </div>
        <Badge statut={t.statut}/>
      </div>
      <div style={{ ...mob.row, border:"none" }}>
        <span style={mob.label}>Mois</span>
        <span style={{ ...mob.val, color:"#64748b" }}>{selectedMonth}</span>
      </div>
    </div>
  );

  return (
    <div style={S.appWrap}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{ ...S.sidebar, display:"flex", background:"#0f172a" }}>
          <SidebarInner/>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMenuOpen && (
        <div style={S.overlay} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            position:"fixed", left:0, top:0, height:"100vh", width:270,
            background:"#0f172a", display:"flex", flexDirection:"column",
            boxShadow:"4px 0 24px rgba(0,0,0,0.4)", zIndex:200,
          }} onClick={e => e.stopPropagation()}>
            <SidebarInner/>
          </div>
        </div>
      )}

      <main style={S.main}>

        {/* Header */}
        <header style={{ ...S.header, padding: isMobile ? "14px 16px" : "0 32px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {isMobile && (
              <button onClick={() => setIsMenuOpen(true)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}>
                <Menu size={22} color="#0f172a"/>
              </button>
            )}
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: isMobile ? 17 : undefined }}>
                {navItems.find(n => n.key === tab)?.label}
              </h2>
              {/* Sélecteur de mois stylé */}
              <div style={{ position:"relative", display:"inline-block" }}>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  style={{
                    appearance:"none", border:"none", background:"transparent",
                    cursor:"pointer", fontWeight:700, color:"#6366f1",
                    fontSize:12, outline:"none", fontFamily:"inherit",
                    paddingRight:14,
                  }}>
                  {getRecentMonths().map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <span style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", fontSize:8, color:"#6366f1", pointerEvents:"none" }}>▼</span>
              </div>
            </div>
          </div>
          <Badge statut={me.statut}/>
        </header>

        {/* Content — centré sur desktop */}
        <div style={{
          ...S.content,
          padding: isMobile ? "16px" : "32px",
          maxWidth: 860,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}>
          {loading ? <Spinner/> : (
            <div className="fade-in">

              {/* ══════════ PROFIL ══════════ */}
              {tab === "profil" && (
                <div>

                  {/* Hero Card */}
                  <div style={{
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #0ea5e9 100%)",
                    padding: isMobile ? "20px 18px" : "28px 32px",
                    marginBottom: 20,
                    boxShadow: "0 12px 32px rgba(99,102,241,0.35)",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 16 : 24,
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 16, flexShrink: 0,
                      background: "rgba(255,255,255,0.2)",
                      border: "2px solid rgba(255,255,255,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, fontWeight: 800, color: "#fff",
                    }}>
                      {me.nom?.[0]}
                    </div>

                    {/* Infos */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <h3 style={{
                        margin:0, color:"#fff", fontWeight:800,
                        fontSize: isMobile ? 20 : 26,
                        letterSpacing:"-0.025em",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                      }}>
                        {me.nom}
                      </h3>
                      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, color:"rgba(255,255,255,0.65)", marginTop:6, fontSize:13 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:4 }}><Home size={13}/> {me.logement}</span>
                        {me.telephone && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Phone size={13}/> {me.telephone}</span>}
                      </div>
                    </div>

                    {/* Statut pill */}
                    <div style={{
                      background: isPaye ? "rgba(21,128,61,0.3)" : "rgba(185,28,28,0.3)",
                      border: `1px solid ${isPaye ? "rgba(134,239,172,0.5)" : "rgba(252,165,165,0.5)"}`,
                      padding: "10px 20px", borderRadius: 14,
                      textAlign: "center", backdropFilter: "blur(8px)",
                      alignSelf: isMobile ? "stretch" : undefined,
                      minWidth: isMobile ? undefined : 120,
                    }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                        Statut
                      </div>
                      <div style={{ fontSize:15, fontWeight:800, color: isPaye ? "#86efac" : "#fca5a5" }}>
                        {isPaye ? "✓ Payé" : "✗ En attente"}
                      </div>
                    </div>
                  </div>

                  {/* Info Cards 2×2 */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: isMobile ? 10 : 14,
                    marginBottom: 16,
                  }}>
                    {[
                      { label:"Mois sélectionné", val: selectedMonth,          Icon: Calendar,    color:"#6366f1", bg:"rgba(99,102,241,0.08)",  border:"rgba(99,102,241,0.15)"  },
                      { label:"Montant à payer",   val: fmt(me.montant),        Icon: DollarSign,  color:"#15803d", bg:"rgba(21,128,61,0.08)",   border:"rgba(21,128,61,0.15)"   },
                      { label:"Dernier paiement",  val: fmtDate(me.datePaiement), Icon: CheckCircle, color: isPaye ? "#15803d" : "#94a3b8", bg: isPaye ? "rgba(21,128,61,0.08)" : "#f8fafc", border: isPaye ? "rgba(21,128,61,0.15)" : "#f1f5f9" },
                      { label:"Téléphone",         val: me.telephone || "—",   Icon: Phone,       color:"#0369a1", bg:"rgba(3,105,161,0.08)",   border:"rgba(3,105,161,0.15)"   },
                    ].map(r => (
                      <div key={r.label} style={{
                        background: "#fff", borderRadius: 14,
                        padding: isMobile ? "14px" : "18px 20px",
                        border: `1px solid ${r.border}`,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: r.bg, display: "flex",
                          alignItems: "center", justifyContent: "center", marginBottom: 10,
                        }}>
                          <r.Icon size={18} color={r.color} strokeWidth={2}/>
                        </div>
                        <div style={{
                          fontSize: isMobile ? 14 : 17, fontWeight: 800, color: r.color,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          letterSpacing: "-0.01em",
                        }}>
                          {r.val}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginTop: 3 }}>
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alerte */}
                  {!isPaye && (
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 18px",
                      background: "#fffbeb",
                      border: "1px solid #fcd34d",
                      borderLeft: "4px solid #f59e0b",
                      borderRadius: 12,
                    }} className="fade-in">
                      <AlertTriangle size={20} color="#b45309" style={{ flexShrink:0, marginTop:1 }}/>
                      <div>
                        <div style={{ fontWeight:700, color:"#92400e", fontSize:14, marginBottom:3 }}>
                          Paiement en attente
                        </div>
                        <div style={{ color:"#b45309", fontSize:13, lineHeight:1.6 }}>
                          Votre paiement d'électricité pour <strong>{selectedMonth}</strong> n'a pas encore été enregistré. Contactez votre gestionnaire.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ HISTORIQUE ══════════ */}
              {tab === "historique" && (
                <div style={S.tableCard}>
                  <div style={S.tableHeader}>
                    <h3 style={S.tableTitle}>Mes paiements</h3>
                    <span style={{ fontSize:13, color:"#94a3b8" }}>
                      {payments.length} entrée{payments.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {payments.length === 0 ? (
                    <div style={S.emptyState}>
                      <History size={44} strokeWidth={1} style={{ opacity:.3 }}/>
                      <p style={{ fontWeight:600, color:"#64748b" }}>Aucun paiement trouvé</p>
                      <p style={{ fontSize:13, color:"#94a3b8" }}>Votre historique apparaîtra ici.</p>
                    </div>
                  ) : isMobile ? (
                    <div style={{ padding:"12px" }}>
                      {[...payments].reverse().map(p => <PaymentCard key={p.id} p={p}/>)}
                    </div>
                  ) : (
                    <div className="table-scroll">
                      <div style={{ minWidth:500 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}>
                          <span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                        </div>
                        {[...payments].reverse().map(p => (
                          <div key={p.id} className="table-row"
                            style={{ ...S.tableRow, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}
                            onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                            onMouseLeave={e => e.currentTarget.style.background=""}>
                            <span style={{ fontWeight:600, color:"#0f172a" }}>{p.mois}</span>
                            <span style={{ fontWeight:700, color:"#4f46e5" }}>{fmt(p.montant)}</span>
                            <span style={{ color:"#64748b", fontSize:13 }}>{fmtDate(p.date)}</span>
                            <Badge statut={p.statut}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ LOCATAIRES ══════════ */}
              {tab === "locataires" && (
                <div>
                  <div style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"12px 16px",
                    background:"#eff6ff", border:"1px solid #bfdbfe",
                    borderRadius:12, marginBottom:16, fontSize:13,
                  }}>
                    <ShieldCheck size={16} color="#1d4ed8" style={{ flexShrink:0 }}/>
                    <span style={{ color:"#1e40af", fontWeight:500 }}>
                      Vue publique — Les informations sensibles sont protégées.
                    </span>
                  </div>

                  <div style={S.tableCard}>
                    <div style={S.tableHeader}>
                      <h3 style={S.tableTitle}>Locataires — {selectedMonth}</h3>
                      <span style={{ fontSize:12, color:"#94a3b8" }}>{processedTenants.length} locataires</span>
                    </div>

                    {isMobile ? (
                      <div style={{ padding:"12px" }}>
                        {processedTenants.map(t => <TenantCard key={t.id} t={t}/>)}
                      </div>
                    ) : (
                      <div className="table-scroll">
                        <div style={{ minWidth:500 }}>
                          <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1fr" }}>
                            <span>Locataire</span><span>Logement</span><span>Mois</span><span>Statut</span>
                          </div>
                          {processedTenants.map(t => (
                            <div key={t.id} className="table-row"
                              style={{
                                ...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1fr",
                                ...(t.id === me.id ? { background:"rgba(99,102,241,0.04)", borderLeft:"3px solid #6366f1" } : {}),
                              }}
                              onMouseEnter={e => { if (t.id !== me.id) e.currentTarget.style.background="#f8fafc"; }}
                              onMouseLeave={e => { if (t.id !== me.id) e.currentTarget.style.background=""; }}>
                              <span style={{ display:"flex", alignItems:"center", gap:10, fontWeight:600 }}>
                                <div style={{ ...S.avatar, width:30, height:30, borderRadius:8, fontSize:12, flexShrink:0 }}>
                                  {t.nom?.[0]}
                                </div>
                                {t.nom}
                                {t.id === me.id && (
                                  <span style={{ fontSize:9, background:"#6366f1", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:800 }}>
                                    MOI
                                  </span>
                                )}
                              </span>
                              <span style={{ color:"#64748b" }}>{t.logement}</span>
                              <span style={{ color:"#64748b", fontSize:13 }}>{selectedMonth}</span>
                              <Badge statut={t.statut}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Styles cards mobile ── */
const mob = {
  card: {
    background:"#fff", borderRadius:12, padding:"14px 16px",
    marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
    border:"1px solid #f1f5f9",
  },
  row: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"6px 0", borderBottom:"1px solid #f8fafc",
  },
  label: { fontSize:12, color:"#94a3b8", fontWeight:600 },
  val:   { fontSize:13, fontWeight:500, color:"#334155" },
};