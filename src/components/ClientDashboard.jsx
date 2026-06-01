import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Zap, User, LogOut, History, Building2, Phone, Calendar,
  DollarSign, Home, AlertTriangle, ShieldCheck, Menu, X
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

  useEffect(() => {
    const load = async () => {
      try {
        const [tSnap, pSnap] = await Promise.all([
          getDocs(collection(db, "clients")),
          getDocs(query(collection(db, "paiements"), where("clientId","==", user.tenant.id))),
        ]);
        setTenants(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
    const handleResize = () => { if (window.innerWidth > 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user.tenant.id]);

  const me = tenants.find(t => t.id === user.tenant.id) || user.tenant;

  const navItems = [
    { key:"profil",     Icon: User,      label:"Mon profil" },
    { key:"historique", Icon: History,   label:"Historique" },
    { key:"locataires", Icon: Building2, label:"Locataires" },
  ];

  const SidebarContent = () => (
    <>
      <div style={S.sidebarLogo}>
        <div style={S.sidebarLogoIcon}><Zap size={20} color="#fff" strokeWidth={2.5}/></div>
        ElecPay
      </div>
      <nav style={S.sidebarNav}>
        {navItems.map(({ key, Icon, label }) => (
          <button key={key} onClick={() => { setTab(key); setIsMenuOpen(false); }}
            style={{ ...S.navItem, ...(tab===key ? S.navItemActive : {}) }}>
            <Icon size={18} strokeWidth={tab===key ? 2.5 : 2}/> {label}
          </button>
        ))}
      </nav>
      <div style={S.sidebarFooter}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"0 8px" }}>
          <div style={{ ...S.avatar, width:32, height:32, fontSize:14 }}>{me.nom?.[0]}</div>
          <span style={{ fontSize:13, fontWeight:600, color:"#f8fafc" }}>{me.nom?.split(' ')[0]}</span>
        </div>
        <button onClick={onLogout} style={S.logoutBtn}>
          <LogOut size={16}/> Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div style={S.appWrap}>
      {/* Desktop Sidebar */}
      <aside style={{ ...S.sidebar, display: window.innerWidth <= 768 ? 'none' : 'flex', background:'#0f172a' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div style={S.overlay} onClick={() => setIsMenuOpen(false)}>
          <aside style={{ ...S.sidebar, position:'fixed', left:0, top:0, height:'100vh', width:280, background:'#0f172a' }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main style={S.main}>
        <header style={S.header}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {window.innerWidth <= 768 && (
              <button onClick={() => setIsMenuOpen(true)} style={{ background:'none', border:'none', padding:0, cursor:'pointer' }}>
                <Menu size={24} color="#0f172a" />
              </button>
            )}
            <div>
              <h2 style={S.pageTitle}>{navItems.find(n=>n.key===tab)?.label}</h2>
              <p style={S.pageSub}>{CURRENT_MONTH}</p>
            </div>
          </div>
          <Badge statut={me.statut} />
        </header>

        <div style={S.content} className="fade-in">
          {loading ? <Spinner/> : (
            <>
              {tab === "profil" && (
                <div style={{ maxWidth:800 }}>
                  <div style={S.profileHero}>
                    <div style={S.avatarLarge}>{me.nom?.[0]}</div>
                    <div style={S.heroContent}>
                      <h3 style={{ margin:0, fontSize:32, fontWeight:800 }}>{me.nom}</h3>
                      <div style={{ display:"flex", alignItems:"center", gap:8, opacity:0.8, marginTop:8 }}>
                        <Home size={18}/> {me.logement}
                      </div>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.2)', padding:'12px 20px', borderRadius:16, backdropFilter:'blur(10px)' }}>
                      <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', opacity:0.8 }}>Statut</div>
                      <div style={{ fontSize:18, fontWeight:800 }}>{me.statut?.toUpperCase()}</div>
                    </div>
                  </div>

                  <div style={S.statsGrid}>
                    {[
                      { label:"Mois en cours", val:me.mois, Icon: Calendar, color:"#6366f1" },
                      { label:"Montant à payer", val:fmt(me.montant), Icon: DollarSign, color:"#0d9f6e" },
                      { label:"Dernier paiement", val:me.datePaiement || "En attente", Icon: Calendar, color:"#f97316" },
                      { label:"Téléphone", val:me.telephone, Icon: Phone, color:"#0ea5e9" },
                    ].map(r => (
                      <div key={r.label} style={S.statCard}>
                        <div style={{ ...S.statIcon, background:`${r.color}15` }}>
                          <r.Icon size={24} color={r.color} />
                        </div>
                        <div style={S.statValue}>{r.val}</div>
                        <div style={S.statLabel}>{r.label}</div>
                      </div>
                    ))}
                  </div>

                  {me.statut !== "payé" && (
                    <div style={{ ...S.statCard, borderLeft:'4px solid #f59e0b', background:'#fffbeb', display:'flex', flexDirection:'row', alignItems:'center', gap:16 }}>
                      <AlertTriangle size={32} color="#b45309" />
                      <div>
                        <h4 style={{ margin:0, color:'#92400e', fontSize:16, fontWeight:700 }}>Paiement en attente</h4>
                        <p style={{ margin:'4px 0 0', color:'#b45309', fontSize:14 }}>
                          Votre loyer de <strong>{me.mois}</strong> n'a pas encore été enregistré.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "historique" && (
                <div style={S.tableCard}>
                  <div style={S.tableHeader}>
                    <h3 style={S.tableTitle}>Historique de mes paiements</h3>
                  </div>
                  {payments.length === 0 ? (
                    <div style={{ padding:60, textAlign:'center', color:'#94a3b8' }}>
                      <History size={48} style={{ marginBottom:16, opacity:0.3 }} />
                      <p>Aucun paiement trouvé.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX:'auto' }}>
                      <div style={{ minWidth: 600 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}>
                          <span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                        </div>
                        {payments.slice().reverse().map(p => (
                          <div key={p.id} style={{ ...S.tableRow, gridTemplateColumns:"1.5fr 1fr 1.5fr 1fr" }}>
                            <span style={{ fontWeight:700 }}>{p.mois}</span>
                            <span style={{ fontWeight:700 }}>{fmt(p.montant)}</span>
                            <span style={{ color:"#64748b" }}>{p.date}</span>
                            <Badge statut={p.statut}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "locataires" && (
                <div>
                  <div style={{ background:'#e0e7ff', color:'#4338ca', padding:'12px 20px', borderRadius:12, display:'flex', alignItems:'center', gap:10, marginBottom:24, fontSize:14, fontWeight:500 }}>
                    <ShieldCheck size={18}/>
                    Vue publique : Les données sensibles sont protégées.
                  </div>
                  <div style={S.tableCard}>
                    <div style={{ overflowX:'auto' }}>
                      <div style={{ minWidth: 600 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1fr" }}>
                          <span>Locataire</span><span>Logement</span><span>Mois</span><span>Statut</span>
                        </div>
                        {tenants.map(t => (
                          <div key={t.id} style={{ ...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1fr",
                            ...(t.id===me.id ? { background:"rgba(99,102,241,0.05)" } : {}) }}>
                            <span style={{ fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                              {t.nom}
                              {t.id===me.id && (
                                <span style={{ fontSize:10, background:"#6366f1", color:"#fff",
                                  padding:"2px 8px", borderRadius:20, fontWeight:800, textTransform:'uppercase' }}>Moi</span>
                              )}
                            </span>
                            <span style={{ color:"#64748b" }}>{t.logement}</span>
                            <span style={{ color:"#64748b" }}>{t.mois}</span>
                            <Badge statut={t.statut}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
