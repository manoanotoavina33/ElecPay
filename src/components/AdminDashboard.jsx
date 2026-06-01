import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, query, where
} from "firebase/firestore";
import {
  Zap, LayoutDashboard, Users, CreditCard, Bell, LogOut,
  CheckCircle, XCircle, AlertTriangle, User,
  DollarSign, Plus, Pencil, Trash2, Send, ShieldCheck, Home, Phone, Menu, X
} from "lucide-react";
import { db } from "../config/firebase";
import { S } from "../styles/theme";
import { Badge, Spinner } from "./Common";
import { CURRENT_MONTH, fmt } from "../utils/helpers";

export default function AdminDashboard({ onLogout }) {
  const [tenants, setTenants]     = useState([]);
  const [payments, setPayments]   = useState([]);
  const [tab, setTab]             = useState("dashboard");
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState({});
  const [loading, setLoading]     = useState(true);
  const [notifSent, setNotifSent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadAll = async () => {
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
  };

  useEffect(() => { 
    loadAll();
    const handleResize = () => { if (window.innerWidth > 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = {
    total:    tenants.length,
    payes:    tenants.filter(t => t.statut === "payé").length,
    retards:  tenants.filter(t => t.statut === "retard").length,
    nonPayes: tenants.filter(t => t.statut === "non payé").length,
    revenus:  payments.filter(p => p.mois === CURRENT_MONTH).reduce((a,p) => a + (p.montant||0), 0),
  };

  const openModal  = (type, data={}) => { setModal({ type }); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveTenant = async () => {
    if (!form.nom || !form.logement || !form.montant) return;
    try {
      if (form.id) {
        const { id, ...data } = form;
        await updateDoc(doc(db, "clients", id), data);
      } else {
        await addDoc(collection(db, "clients"), {
          ...form, statut:"non payé", datePaiement:null, mois:CURRENT_MONTH
        });
      }
      await loadAll();
    } catch (e) { console.error(e); }
    closeModal();
  };

  const deleteTenant = async (id) => {
    if(!window.confirm("Supprimer ce locataire ?")) return;
    try {
      await deleteDoc(doc(db, "clients", id));
      const q = query(collection(db, "paiements"), where("clientId","==",id));
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
      await loadAll();
    } catch (e) { console.error(e); }
  };

  const markPaid = async (tenantId) => {
    const today  = new Date().toISOString().split("T")[0];
    const tenant = tenants.find(t => t.id === tenantId);
    try {
      await updateDoc(doc(db, "clients", tenantId), { statut:"payé", datePaiement:today });
      if (tenant) {
        await addDoc(collection(db, "paiements"), {
          clientId: tenantId, montant: tenant.montant,
          date: today, mois: CURRENT_MONTH, statut:"payé"
        });
      }
      await loadAll();
    } catch (e) { console.error(e); }
  };

  const navItems = [
    { key:"dashboard", Icon: LayoutDashboard, label:"Tableau de bord" },
    { key:"tenants",   Icon: Users,           label:"Locataires" },
    { key:"payments",  Icon: CreditCard,      label:"Paiements" },
    { key:"notifs",    Icon: Bell,            label:"Notifications" },
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
          <ShieldCheck size={16} color="#6366f1"/>
          <span style={{ fontSize:13, fontWeight:600, color:"#f8fafc" }}>Admin</span>
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
      <aside style={{ ...S.sidebar, display: window.innerWidth <= 768 ? 'none' : 'flex' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div style={S.overlay} onClick={() => setIsMenuOpen(false)}>
          <aside style={{ ...S.sidebar, position:'fixed', left:0, top:0, height:'100vh', width:280 }} onClick={e => e.stopPropagation()}>
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
          <div style={{ display: window.innerWidth <= 600 ? 'none' : 'block' }}>
            <Badge statut="Administrateur" />
          </div>
        </header>

        <div style={S.content} className="fade-in">
          {loading ? <Spinner/> : (
            <>
              {tab === "dashboard" && (
                <div>
                  <div style={S.statsGrid}>
                    <div style={S.statCard}>
                      <div style={{ ...S.statIcon, background:"rgba(99,102,241,0.1)" }}>
                        <Users size={24} color="#6366f1" />
                      </div>
                      <div style={S.statValue}>{stats.total}</div>
                      <div style={S.statLabel}>Total Locataires</div>
                    </div>
                    <div style={S.statCard}>
                      <div style={{ ...S.statIcon, background:"rgba(13,159,110,0.1)" }}>
                        <CheckCircle size={24} color="#0d9f6e" />
                      </div>
                      <div style={{ ...S.statValue, color:"#0d9f6e" }}>{stats.payes}</div>
                      <div style={S.statLabel}>Déjà Payés</div>
                    </div>
                    <div style={S.statCard}>
                      <div style={{ ...S.statIcon, background:"rgba(239,68,68,0.1)" }}>
                        <XCircle size={24} color="#ef4444" />
                      </div>
                      <div style={{ ...S.statValue, color:"#ef4444" }}>{stats.nonPayes}</div>
                      <div style={S.statLabel}>En Attente</div>
                    </div>
                    <div style={S.statCard}>
                      <div style={{ ...S.statIcon, background:"rgba(14,165,233,0.1)" }}>
                        <DollarSign size={24} color="#0ea5e9" />
                      </div>
                      <div style={{ ...S.statValue, color:"#0ea5e9" }}>{fmt(stats.revenus)}</div>
                      <div style={S.statLabel}>Revenus du Mois</div>
                    </div>
                  </div>

                  <div style={S.tableCard}>
                    <div style={S.tableHeader}>
                      <h3 style={S.tableTitle}>Liste des Paiements</h3>
                      <button onClick={loadAll} style={S.btnSmallBlue}>Actualiser</button>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                      <div style={{ minWidth: 700 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr" }}>
                          <span>Locataire</span><span>Logement</span><span>Montant</span><span>Statut</span><span>Actions</span>
                        </div>
                        {tenants.map(t => (
                          <div key={t.id} style={{ ...S.tableRow, gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr" }}> 
                            <span style={{ fontWeight:700, color:'#0f172a' }}>{t.nom}</span>
                            <span style={{ color:"#64748b" }}>{t.logement}</span>
                            <span style={{ fontWeight:700 }}>{fmt(t.montant)}</span>
                            <Badge statut={t.statut}/>
                            <div style={{ display:'flex', gap:8 }}>
                              {t.statut !== "payé" ? (
                                <button onClick={() => markPaid(t.id)} style={S.btnSmallGreen}>
                                  <CheckCircle size={14}/> Encaisser
                                </button>
                              ) : (
                                <span style={{ color:'#0d9f6e', fontSize:12, fontWeight:600 }}>Payé le {t.datePaiement}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "tenants" && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:'center', marginBottom:24 }}>
                    <h3 style={{ margin:0, fontSize:18, fontWeight:700 }}>Gestion des Locataires</h3>
                    <button onClick={() => openModal("tenant")} style={S.btnPrimary}>
                      <Plus size={18}/> Nouveau
                    </button>
                  </div>
                  <div style={S.tableCard}>
                    <div style={{ overflowX:'auto' }}>
                      <div style={{ minWidth: 800 }}>
                        <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1fr 1.5fr" }}>
                          <span>Nom</span><span>Logement</span><span>Téléphone</span><span>Loyer</span><span>Actions</span>
                        </div>
                        {tenants.map(t => (
                          <div key={t.id} style={{ ...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1fr 1.5fr" }}>     
                            <span style={{ fontWeight:700 }}>{t.nom}</span>
                            <span>{t.logement}</span>
                            <span style={{ color:"#64748b" }}>{t.telephone}</span>
                            <span style={{ fontWeight:700 }}>{fmt(t.montant)}</span>
                            <div style={{ display:"flex", gap:8 }}>
                              <button onClick={() => openModal("tenant", { ...t })} style={S.btnSmallBlue}>
                                <Pencil size={14}/> Modifier
                              </button>
                              <button onClick={() => deleteTenant(t.id)} style={S.btnSmallRed}>
                                <Trash2 size={14}/> Suppr.
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "payments" && (
                <div style={S.tableCard}>
                  <div style={S.tableHeader}>
                    <h3 style={S.tableTitle}>Historique des Transactions</h3>
                  </div>
                  <div style={{ overflowX:'auto' }}>
                    <div style={{ minWidth: 700 }}>
                      <div style={{ ...S.tableHead, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr" }}>
                        <span>Locataire</span><span>Mois</span><span>Montant</span><span>Date</span><span>Statut</span>
                      </div>
                      {payments.slice().reverse().map(p => {
                        const t = tenants.find(x => x.id === p.clientId);
                        return (
                          <div key={p.id} style={{ ...S.tableRow, gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr 1fr" }}>     
                            <span style={{ fontWeight:700 }}>{t?.nom || "—"}</span>
                            <span>{p.mois}</span>
                            <span style={{ fontWeight:700 }}>{fmt(p.montant)}</span>
                            <span style={{ color:"#64748b", fontSize:14 }}>{p.date}</span>
                            <Badge statut={p.statut}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {tab === "notifs" && (
                <div style={{ maxWidth:600, margin:'0 auto' }}>
                  <div style={S.notifCard} className="fade-in">
                    <div style={S.notifIconWrap}><Bell size={32} color="#6366f1" /></div>      
                    <h3 style={{ margin:"20px 0 8px", fontSize:24, fontWeight:800 }}>Rappels</h3>
                    <p style={{ color:"#64748b", marginBottom:24 }}>
                      Envoyer un rappel aux locataires n'ayant pas encore payé pour <strong>{CURRENT_MONTH}</strong>.
                    </p>
                    <div style={{ marginBottom:24 }}>
                      {tenants.filter(t => t.statut !== "payé").map(t => (
                        <div key={t.id} style={S.notifRow}>
                          <span><strong>{t.nom}</strong> ({t.logement})</span>
                          <Badge statut={t.statut}/>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setNotifSent(true); setTimeout(() => setNotifSent(false), 4000); }}
                      style={{ ...S.btnPrimary, width:"100%", justifyContent:"center", padding:16 }}>
                      <Send size={18}/> Envoyer les rappels par SMS/Email
                    </button>
                    {notifSent && (
                      <div style={S.notifSuccess}>
                        <CheckCircle size={18} /> Rappels envoyés avec succès !
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {modal?.type === "tenant" && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()} className="fade-in">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ margin:0, fontSize:20, fontWeight:800 }}>
                {form.id ? "Modifier le locataire" : "Nouveau locataire"}
              </h3>
              <button onClick={closeModal} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20}/></button>
            </div>
            {[
              { key:"nom",       label:"Nom complet",           Icon: User,       type:"text"   },
              { key:"logement",  label:"N° de logement",        Icon: Home,       type:"text"   },
              { key:"telephone", label:"Téléphone",             Icon: Phone,      type:"text"   },
              { key:"montant",   label:"Loyer mensuel (Ar)",    Icon: DollarSign, type:"number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:700, color:'#475569', display:'block', marginBottom:6 }}>{f.label}</label>      
                <div style={{ position:'relative' }}>
                  <f.Icon size={16} style={{ position:'absolute', left:12, top:12, color:'#94a3b8' }}/>
                  <input type={f.type} placeholder={f.label} value={form[f.key]||""}
                    onChange={e => setForm(p => ({...p, [f.key]: f.type==="number" ? +e.target.value : e.target.value}))}
                    style={{ ...S.modalInput, paddingLeft:40, marginTop:0 }}/>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:32 }}>
              <button onClick={closeModal} style={{ ...S.btnPrimary, background:'#f1f5f9', color:'#475569', flex:1, justifyContent:'center' }}>Annuler</button>
              <button onClick={saveTenant} style={{ ...S.btnPrimary, flex:1, justifyContent:'center' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
