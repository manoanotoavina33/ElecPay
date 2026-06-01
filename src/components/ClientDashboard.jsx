import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Zap, User, LogOut, History, Building2, Phone,
  Calendar, DollarSign, Home, AlertTriangle, ShieldCheck,
  Menu, CheckCircle, ChevronRight
} from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt } from "../utils/helpers";

export default function ClientDashboard({ user, onLogout }) {
  const [tenants,  setTenants]  = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab]           = useState("profil");
  const [loading, setLoading]   = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile]    = useState(window.innerWidth <= 768);

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
      try {
        const [tSnap, pSnap] = await Promise.all([
          getDocs(collection(db, "clients")),
          getDocs(query(collection(db, "paiements"), where("clientId", "==", user.tenant.id))),
        ]);
        setTenants(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [user.tenant.id]);

  const me = tenants.find(t => t.id === user.tenant.id) || user.tenant;
  const isPaye = me.statut === "payé";

  const navItems = [
    { key: "profil",     Icon: User,      label: "Mon profil"  },
    { key: "historique", Icon: History,   label: "Historique"  },
    { key: "locataires", Icon: Building2, label: "Locataires"  },
  ];

  const SidebarContent = () => (
    <>
      <div style={S.sidebarLogo}>
        <div style={S.sidebarLogoIcon}>
          <Zap size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={S.sidebarLogoText}>ElecPay</div>
          <div style={S.sidebarLogoSub}>Électricité</div>
        </div>
      </div>
      <nav style={S.sidebarNav}>
        <div style={S.sidebarSection}>Navigation</div>
        {navItems.map(({ key, Icon, label }) => (
          <button key={key}
            onClick={() => { setTab(key); setIsMenuOpen(false); }}
            style={{ ...S.navItem, ...(tab === key ? S.navItemActive : {}) }}>
            <Icon size={17} strokeWidth={tab === key ? 2.5 : 2} />
            <span style={{ flex: 1 }}>{label}</span>
            {tab === key && <div style={S.navDot} />}
          </button>
        ))}
      </nav>
      <div style={S.sidebarFooter}>
        <div style={S.userCard}>
          <div style={S.avatar}>{me.nom?.[0]}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {me.nom?.split(" ")[0]}
            </div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>{me.logement}</div>
          </div>
        </div>
        <button onClick={onLogout} style={S.logoutBtn}>
          <LogOut size={15} /> Déconnexion
        </button>
      </div>
    </>
  );

  /* ── Carte mobile pour un paiement ── */
  const PaymentCard = ({ p }) => (
    <div style={mob.card}>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Mois</span>
        <span style={mob.cardValue}>{p.mois}</span>
      </div>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Montant</span>
        <span style={{ ...mob.cardValue, fontWeight:700, color:"#0f172a" }}>{fmt(p.montant)}</span>
      </div>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Date</span>
        <span style={{ ...mob.cardValue, color:"#64748b" }}>{p.date}</span>
      </div>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Statut</span>
        <Badge statut={p.statut} />
      </div>
    </div>
  );

  /* ── Carte mobile pour un locataire ── */
  const TenantCard = ({ t }) => (
    <div style={{
      ...mob.card,
      ...(t.id === me.id ? { borderLeft:"3px solid #6366f1", background:"rgba(99,102,241,0.04)" } : {}),
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ ...S.avatar, width:34, height:34, borderRadius:9, fontSize:13, flexShrink:0 }}>
          {t.nom?.[0]}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, color:"#0f172a", fontSize:14 }}>{t.nom}</div>
          <div style={{ fontSize:12, color:"#64748b" }}>{t.logement}</div>
        </div>
        {t.id === me.id && (
          <span style={{ fontSize:10, background:"#6366f1", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:800 }}>Moi</span>
        )}
      </div>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Mois</span>
        <span style={{ ...mob.cardValue, color:"#64748b" }}>{t.mois}</span>
      </div>
      <div style={mob.cardRow}>
        <span style={mob.cardLabel}>Statut</span>
        <Badge statut={t.statut} />
      </div>
    </div>
  );

  return (
    <div style={S.appWrap}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{ ...S.sidebar, display:"flex", background:"#0f172a" }}>
          <div style={{ ...S.sidebarLogo, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={S.sidebarLogoIcon}><Zap size={20} color="#fff" strokeWidth={2.5} /></div>
            <div>
              <div style={{ ...S.sidebarLogoText, color:"#f8fafc" }}>ElecPay</div>
              <div style={{ ...S.sidebarLogoSub, color:"rgba(255,255,255,0.3)" }}>Électricité</div>
            </div>
          </div>
          <nav style={S.sidebarNav}>
            <div style={{ ...S.sidebarSection, color:"rgba(255,255,255,0.25)" }}>Navigation</div>
            {navItems.map(({ key, Icon, label }) => (
              <button key={key} onClick={() => setTab(key)}
                style={{
                  ...S.navItem, color: tab === key ? "#fff" : "rgba(255,255,255,0.45)",
                  ...(tab === key ? { background:"rgba(255,255,255,0.1)" } : {}),
                }}>
                <Icon size={17} strokeWidth={tab === key ? 2.5 : 2} />
                <span style={{ flex:1 }}>{label}</span>
                {tab === key && <div style={{ ...S.navDot, background:"#6366f1" }} />}
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
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && isMenuOpen && (
        <div style={S.overlay} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            position:"fixed", left:0, top:0, height:"100vh", width:270,
            background:"#0f172a", display:"flex", flexDirection:"column",
            boxShadow:"4px 0 24px rgba(0,0,0,0.3)", zIndex:200,
          }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <main style={S.main}>
        {/* Header */}
        <header style={{ ...S.header, padding: isMobile ? "14px 16px" : S.header?.padding }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {isMobile && (
              <button onClick={() => setIsMenuOpen(true)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }}>
                <Menu size={22} color="#0f172a" />
              </button>
            )}
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: isMobile ? 17 : undefined }}>
                {navItems.find(n => n.key === tab)?.label}
              </h2>
              <p style={S.pageSub}>{CURRENT_MONTH}</p>
            </div>
          </div>
          <Badge statut={me.statut} />
        </header>

        {/* Content */}
        <div style={{ ...S.content, padding: isMobile ? "16px" : S.content?.padding }}>
          {loading ? <Spinner /> : (
            <div className="fade-in">

              {/* ── PROFIL ── */}
              {tab === "profil" && (
                <div style={{ maxWidth:800 }}>
                  {/* Hero Card */}
                  <div style={{
                    ...S.profileHero,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 14 : undefined,
                    padding: isMobile ? "20px 16px" : undefined,
                  }}>
                    <div style={{ ...S.avatarLg, boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>
                      {me.nom?.[0]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <h3 style={{ ...S.heroName, fontSize: isMobile ? 20 : undefined }}>{me.nom}</h3>
                      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, color:"rgba(255,255,255,0.7)", marginTop:6, fontSize:14 }}>
                        <Home size={15} /> {me.logement}
                        {me.telephone && (
                          <><span style={{ opacity:.5 }}>·</span><Phone size={15} /> {me.telephone}</>
                        )}
                      </div>
                    </div>
                    <div style={{
                      background: isPaye ? "rgba(21,128,61,0.25)" : "rgba(185,28,28,0.25)",
                      border: `1px solid ${isPaye ? "rgba(134,239,172,0.4)" : "rgba(252,165,165,0.4)"}`,
                      padding:"12px 20px", borderRadius:14, textAlign:"center",
                      backdropFilter:"blur(8px)", alignSelf: isMobile ? "stretch" : undefined,
                    }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Statut</div>
                      <div style={{ fontSize:16, fontWeight:800, color:isPaye ? "#86efac" : "#fca5a5" }}>
                        {isPaye ? "✓ Payé" : "✗ En attente"}
                      </div>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div style={{
                    ...S.statsGrid,
                    gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
                    gap: isMobile ? 10 : undefined,
                  }}>
                    {[
                      { label:"Mois en cours",   val: me.mois || CURRENT_MONTH, Icon: Calendar,    color:"#6366f1", bg:"rgba(99,102,241,0.08)" },
                      { label:"Montant à payer",  val: fmt(me.montant),          Icon: DollarSign,  color:"#15803d", bg:"rgba(21,128,61,0.08)"  },
                      { label:"Dernier paiement", val: me.datePaiement || "—",   Icon: CheckCircle, color: isPaye ? "#15803d" : "#94a3b8", bg: isPaye ? "rgba(21,128,61,0.08)" : "#f8fafc" },
                      { label:"Téléphone",        val: me.telephone || "—",      Icon: Phone,       color:"#0369a1", bg:"rgba(3,105,161,0.08)"  },
                    ].map(r => (
                      <div key={r.label} style={{ ...S.statCard, padding: isMobile ? "14px" : undefined }}>
                        <div style={{ ...S.statIconWrap, background: r.bg }}>
                          <r.Icon size={20} color={r.color} strokeWidth={2} />
                        </div>
                        <div style={{ ...S.statValue, fontSize: isMobile ? 14 : 18, color: r.color, wordBreak:"break-word" }}>{r.val}</div>
                        <div style={S.statLabel}>{r.label}</div>
                      </div>
                    ))}
                  </div>

                  {!isPaye && (
                    <div style={S.alertWarning} className="fade-in">
                      <AlertTriangle size={24} color="#b45309" style={{ flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:700, color:"#92400e", fontSize:15, marginBottom:3 }}>Paiement en attente</div>
                        <div style={{ color:"#b45309", fontSize:13, lineHeight:1.5 }}>
                          Votre paiement d'électricité pour <strong>{me.mois || CURRENT_MONTH}</strong> n'a pas encore été enregistré. Contactez votre gestionnaire.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── HISTORIQUE ── */}
              {tab === "historique" && (
                <div style={S.tableCard}>
                  <div style={S.tableHeader}>
                    <h3 style={S.tableTitle}>Mes paiements</h3>
                    <span style={{ fontSize:13, color:"#94a3b8" }}>{payments.length} entrée{payments.length > 1 ? "s" : ""}</span>
                  </div>
                  {payments.length === 0 ? (
                    <div style={S.emptyState}>
                      <History size={48} strokeWidth={1} />
                      <p style={{ fontWeight:500 }}>Aucun paiement trouvé</p>
                      <p style={{ fontSize:13 }}>Votre historique apparaîtra ici.</p>
                    </div>
                  ) : isMobile ? (
                    <div style={{ padding:"12px" }}>
                      {[...payments].reverse().map(p => <PaymentCard key={p.id} p={p} />)}
                    </div>
                  ) : (
                    <div className="table-scroll">
                      <div style={{ minWidth:500 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}>
                          <span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                        </div>
                        {[...payments].reverse().map(p => (
                          <div key={p.id} className="table-row"
                            style={{ ...S.tableRow, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}>
                            <span style={{ fontWeight:600 }}>{p.mois}</span>
                            <span style={{ fontWeight:700, color:"#0f172a" }}>{fmt(p.montant)}</span>
                            <span style={{ color:"#64748b", fontSize:13 }}>{p.date}</span>
                            <Badge statut={p.statut} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── LOCATAIRES ── */}
              {tab === "locataires" && (
                <div>
                  <div style={S.alertInfo}>
                    <ShieldCheck size={16} color="#1d4ed8" style={{ flexShrink:0 }} />
                    <span style={{ color:"#1e40af", fontWeight:500 }}>
                      Vue publique — Les informations sensibles sont protégées.
                    </span>
                  </div>
                  <div style={S.tableCard}>
                    <div style={S.tableHeader}>
                      <h3 style={S.tableTitle}>Locataires — {CURRENT_MONTH}</h3>
                    </div>
                    {isMobile ? (
                      <div style={{ padding:"12px" }}>
                        {tenants.map(t => <TenantCard key={t.id} t={t} />)}
                      </div>
                    ) : (
                      <div className="table-scroll">
                        <div style={{ minWidth:500 }}>
                          <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1fr" }}>
                            <span>Locataire</span><span>Logement</span><span>Mois</span><span>Statut</span>
                          </div>
                          {tenants.map(t => (
                            <div key={t.id} className="table-row"
                              style={{
                                ...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1fr",
                                ...(t.id === me.id ? { background:"rgba(99,102,241,0.04)", borderLeft:"3px solid #6366f1" } : {}),
                              }}>
                              <span style={{ display:"flex", alignItems:"center", gap:10, fontWeight:600 }}>
                                <div style={{ ...S.avatar, width:30, height:30, borderRadius:8, fontSize:12, flexShrink:0 }}>
                                  {t.nom?.[0]}
                                </div>
                                {t.nom}
                                {t.id === me.id && (
                                  <span style={{ fontSize:10, background:"#6366f1", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:800 }}>Moi</span>
                                )}
                              </span>
                              <span style={{ color:"#64748b" }}>{t.logement}</span>
                              <span style={{ color:"#64748b", fontSize:13 }}>{t.mois}</span>
                              <Badge statut={t.statut} />
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

/* ── Styles cartes mobile ── */
const mob = {
  card: {
    background:"#fff", borderRadius:12, padding:"14px 16px",
    marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
    border:"1px solid #f1f5f9",
  },
  cardRow: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"5px 0", borderBottom:"1px solid #f8fafc",
  },
  cardLabel: { fontSize:12, color:"#94a3b8", fontWeight:600 },
  cardValue:  { fontSize:13, fontWeight:500, color:"#334155" },
};