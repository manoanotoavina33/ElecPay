// theme.js — ElecPay Design System v2
export const S = {

  // ── LOGIN ────────────────────────────────────────────────────────────────
  loginWrap: {
    minHeight:"100vh", display:"flex", background:"#f0f2ff",
    fontFamily:"'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  loginLeft: {
    flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
    alignItems:"center", padding:"48px 40px", background:"#fff",
    boxShadow:"4px 0 32px rgba(99,102,241,0.07)",
  },
  loginRight: {
    flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
    alignItems:"center", padding:48,
    background:"linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
  },
  loginBrand: {
    display:"flex", alignItems:"center", gap:12, marginBottom:40,
  },
  loginBrandIcon: {
    width:44, height:44, borderRadius:12,
    background:"linear-gradient(135deg, #6366f1, #4338ca)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 4px 12px rgba(99,102,241,0.35)",
  },
  loginBrandName: {
    fontSize:26, fontWeight:800, color:"#1e293b", letterSpacing:"-0.03em",
  },
  loginTitle: {
    fontSize:28, fontWeight:800, color:"#0f172a", marginBottom:8,
    letterSpacing:"-0.025em", lineHeight:1.2,
  },
  loginSub: {
    fontSize:15, color:"#64748b", marginBottom:36, lineHeight:1.6,
  },
  roleToggle: {
    display:"flex", gap:4, marginBottom:28, background:"#f1f5f9",
    borderRadius:12, padding:4, width:"100%",
  },
  roleBtn: {
    flex:1, padding:"10px 0", borderRadius:8, border:"none",
    background:"transparent", color:"#64748b", cursor:"pointer",
    fontSize:14, fontWeight:600, display:"flex", alignItems:"center",
    justifyContent:"center", gap:8, transition:"all 0.2s",
  },
  roleBtnActive: {
    background:"#fff", color:"#4f46e5",
    boxShadow:"0 2px 8px rgba(99,102,241,0.18)", fontWeight:700,
  },
  formGroup: { marginBottom:18, width:"100%" },
  label: {
    display:"block", fontSize:13, fontWeight:600, color:"#374151",
    marginBottom:7, letterSpacing:"0.01em",
  },
  input: {
    width:"100%", padding:"13px 16px", borderRadius:10,
    border:"1.5px solid #e2e8f0", background:"#fafafa", color:"#0f172a",
    fontSize:15, boxSizing:"border-box", outline:"none",
    transition:"border-color 0.2s, box-shadow 0.2s", fontFamily:"inherit",
  },
  inputFocus: {
    borderColor:"#6366f1", boxShadow:"0 0 0 3px rgba(99,102,241,0.12)",
    background:"#fff",
  },
  errMsg: {
    color:"#dc2626", fontSize:13, marginTop:8, fontWeight:500,
    display:"flex", alignItems:"center", gap:6,
  },
  loginBtn: {
    width:"100%", padding:"14px", borderRadius:10, border:"none",
    background:"linear-gradient(135deg, #6366f1, #4f46e5)",
    color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    transition:"all 0.2s", boxShadow:"0 4px 14px rgba(99,102,241,0.3)",
    letterSpacing:"-0.01em", fontFamily:"inherit",
  },

  // ── APP SHELL ────────────────────────────────────────────────────────────
  appWrap: {
    display:"flex", minHeight:"100vh", background:"#f8fafc",
    fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",
  },

  // ── SIDEBAR ──────────────────────────────────────────────────────────────
  sidebar: {
    width:256, background:"#fff", display:"flex", flexDirection:"column",
    position:"sticky", top:0, height:"100vh", zIndex:50, flexShrink:0,
    borderRight:"1px solid #f1f5f9",
    boxShadow:"2px 0 16px rgba(0,0,0,0.04)",
  },
  sidebarLogo: {
    padding:"28px 20px 20px", display:"flex", alignItems:"center", gap:12,
    borderBottom:"1px solid #f1f5f9",
  },
  sidebarLogoIcon: {
    width:38, height:38, borderRadius:10,
    background:"linear-gradient(135deg, #6366f1, #4338ca)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 3px 10px rgba(99,102,241,0.3)",
  },
  sidebarLogoText: {
    fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.025em",
  },
  sidebarLogoSub: {
    fontSize:11, fontWeight:500, color:"#94a3b8", letterSpacing:"0.05em",
    textTransform:"uppercase", marginTop:1,
  },
  sidebarNav: { flex:1, padding:"16px 12px", overflowY:"auto" },
  sidebarSection: {
    fontSize:10, fontWeight:700, color:"#cbd5e1", letterSpacing:"0.1em",
    textTransform:"uppercase", padding:"0 8px", marginBottom:6, marginTop:16,
  },
  navItem: {
    width:"100%", display:"flex", alignItems:"center", gap:10,
    padding:"10px 12px", borderRadius:10, border:"none",
    background:"transparent", color:"#64748b", cursor:"pointer",
    fontSize:14, fontWeight:500, textAlign:"left", marginBottom:2,
    transition:"all 0.18s", letterSpacing:"-0.01em", fontFamily:"inherit",
  },
  navItemActive: {
    background:"rgba(99,102,241,0.08)", color:"#4f46e5", fontWeight:600,
  },
  navDot: {
    width:6, height:6, borderRadius:"50%", background:"#6366f1",
    marginLeft:"auto", flexShrink:0,
  },
  sidebarFooter: {
    padding:"16px 12px", borderTop:"1px solid #f1f5f9",
  },
  userCard: {
    display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
    borderRadius:10, background:"#f8fafc", marginBottom:10,
    border:"1px solid #f1f5f9",
  },
  avatar: {
    width:36, height:36, borderRadius:10,
    background:"linear-gradient(135deg, #6366f1, #4338ca)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:14, fontWeight:700, color:"#fff", flexShrink:0,
  },
  avatarLg: {
    width:52, height:52, borderRadius:14,
    background:"linear-gradient(135deg, #6366f1, #4338ca)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:20, fontWeight:700, color:"#fff", flexShrink:0,
  },
  logoutBtn: {
    width:"100%", padding:"10px 12px", borderRadius:10,
    border:"1px solid #fee2e2", background:"transparent", color:"#dc2626",
    cursor:"pointer", fontSize:14, display:"flex", alignItems:"center",
    justifyContent:"center", gap:8, fontWeight:600, transition:"all 0.2s",
    fontFamily:"inherit",
  },

  // ── MAIN ─────────────────────────────────────────────────────────────────
  main: { flex:1, minWidth:0, display:"flex", flexDirection:"column", background:"#f8fafc" },
  header: {
    height:68, padding:"0 28px", background:"#fff",
    borderBottom:"1px solid #f1f5f9", display:"flex",
    alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:40,
    boxShadow:"0 1px 8px rgba(0,0,0,0.04)",
  },
  pageTitle: { margin:0, fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.025em" },
  pageSub:   { margin:"2px 0 0", fontSize:13, color:"#94a3b8", fontWeight:500 },
  content:   { padding:"28px", maxWidth:1100, width:"100%", boxSizing:"border-box" },

  // ── STATS GRID ───────────────────────────────────────────────────────────
  statsGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",
    gap:16, marginBottom:24,
  },
  statCard: {
    background:"#fff", borderRadius:16, padding:"20px 22px",
    border:"1px solid #f1f5f9", display:"flex", flexDirection:"column",
    boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s",
    position:"relative", overflow:"hidden",
  },
  statIconWrap: {
    width:44, height:44, borderRadius:12, display:"flex",
    alignItems:"center", justifyContent:"center", marginBottom:16, flexShrink:0,
  },
  statValue:  { fontSize:28, fontWeight:800, color:"#0f172a", lineHeight:1, letterSpacing:"-0.03em" },
  statLabel:  { fontSize:13, fontWeight:600, color:"#94a3b8", marginTop:6 },
  statChange: { fontSize:12, fontWeight:600, marginTop:4 },

  // ── TABLE CARD ───────────────────────────────────────────────────────────
  tableCard: {
    background:"#fff", borderRadius:16, border:"1px solid #f1f5f9",
    overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"18px 24px", borderBottom:"1px solid #f8fafc",
  },
  tableTitle: { margin:0, fontSize:16, fontWeight:700, color:"#0f172a" },
  tableHead: {
    display:"grid", background:"#f8fafc", padding:"12px 24px",
    borderBottom:"1px solid #f1f5f9", fontSize:11, fontWeight:700,
    color:"#94a3b8", letterSpacing:"0.06em", textTransform:"uppercase",
  },
  tableRow: {
    display:"grid", padding:"14px 24px", borderBottom:"1px solid #f8fafc",
    alignItems:"center", transition:"background 0.15s", cursor:"default",
  },

  // ── BUTTONS ──────────────────────────────────────────────────────────────
  btnPrimary: {
    padding:"10px 20px", borderRadius:10, border:"none",
    background:"linear-gradient(135deg, #6366f1, #4f46e5)",
    color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14,
    display:"inline-flex", alignItems:"center", gap:8,
    boxShadow:"0 3px 10px rgba(99,102,241,0.25)", transition:"all 0.2s",
    fontFamily:"inherit", letterSpacing:"-0.01em",
  },
  btnOutline: {
    padding:"9px 18px", borderRadius:10,
    border:"1.5px solid #e2e8f0", background:"#fff",
    color:"#374151", fontWeight:600, cursor:"pointer", fontSize:14,
    display:"inline-flex", alignItems:"center", gap:8,
    transition:"all 0.2s", fontFamily:"inherit",
  },
  btnSmallGreen: {
    padding:"6px 12px", borderRadius:8, border:"none",
    background:"#dcfce7", color:"#15803d", fontWeight:700,
    cursor:"pointer", fontSize:12, display:"inline-flex",
    alignItems:"center", gap:5, transition:"all 0.15s", fontFamily:"inherit",
  },
  btnSmallBlue: {
    padding:"6px 12px", borderRadius:8, border:"none",
    background:"#ede9fe", color:"#5b21b6", fontWeight:700,
    cursor:"pointer", fontSize:12, display:"inline-flex",
    alignItems:"center", gap:5, transition:"all 0.15s", fontFamily:"inherit",
  },
  btnSmallRed: {
    padding:"6px 12px", borderRadius:8, border:"none",
    background:"#fee2e2", color:"#b91c1c", fontWeight:700,
    cursor:"pointer", fontSize:12, display:"inline-flex",
    alignItems:"center", gap:5, transition:"all 0.15s", fontFamily:"inherit",
  },
  btnSmallGray: {
    padding:"6px 12px", borderRadius:8, border:"none",
    background:"#f1f5f9", color:"#475569", fontWeight:600,
    cursor:"pointer", fontSize:12, display:"inline-flex",
    alignItems:"center", gap:5, transition:"all 0.15s", fontFamily:"inherit",
  },

  // ── BADGES ───────────────────────────────────────────────────────────────
  badgePaye: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700,
    background:"#dcfce7", color:"#15803d",
  },
  badgeNonPaye: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700,
    background:"#fee2e2", color:"#b91c1c",
  },
  badgeRetard: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700,
    background:"#fef3c7", color:"#b45309",
  },
  badgeAdmin: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700,
    background:"#ede9fe", color:"#5b21b6",
  },

  // ── MODAL ────────────────────────────────────────────────────────────────
  overlay: {
    position:"fixed", inset:0, background:"rgba(15,23,42,0.45)",
    backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
    justifyContent:"center", zIndex:100, padding:20,
  },
  modalCard: {
    background:"#fff", borderRadius:20, padding:"32px 28px",
    width:"100%", maxWidth:440,
    boxShadow:"0 24px 48px -12px rgba(0,0,0,0.18)",
    border:"1px solid #f1f5f9",
  },
  modalTitle: { margin:0, fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.025em" },
  modalInput: {
    width:"100%", padding:"12px 14px 12px 40px", borderRadius:10,
    border:"1.5px solid #e2e8f0", fontSize:14, color:"#0f172a",
    outline:"none", boxSizing:"border-box", marginTop:6,
    transition:"border-color 0.2s, box-shadow 0.2s", fontFamily:"inherit",
    background:"#fafafa",
  },

  // ── PROFILE HERO ────────────────────────────────────────────────────────
  profileHero: {
    borderRadius:20, padding:"28px 32px",
    background:"linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    display:"flex", alignItems:"center", gap:20, marginBottom:24, flexWrap:"wrap",
    boxShadow:"0 8px 24px rgba(99,102,241,0.3)",
  },
  heroName: { margin:0, fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.025em" },
  heroSub:  { margin:"6px 0 0", fontSize:15, color:"rgba(255,255,255,0.75)" },

  // ── ALERT BANNER ────────────────────────────────────────────────────────
  alertWarning: {
    display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
    background:"#fffbeb", border:"1px solid #fcd34d",
    borderLeft:"4px solid #f59e0b", borderRadius:12,
    marginTop:16,
  },
  alertInfo: {
    display:"flex", alignItems:"center", gap:14, padding:"14px 18px",
    background:"#eff6ff", border:"1px solid #bfdbfe",
    borderRadius:12, marginBottom:20, fontSize:13,
  },

  // ── NOTIF CARD ───────────────────────────────────────────────────────────
  notifCard: {
    background:"#fff", borderRadius:20, padding:32,
    border:"1px solid #f1f5f9", boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
    textAlign:"center",
  },
  notifIconWrap: {
    width:72, height:72, borderRadius:20,
    background:"linear-gradient(135deg, rgba(99,102,241,0.1), rgba(67,56,202,0.1))",
    border:"1px solid rgba(99,102,241,0.15)",
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    marginBottom:4,
  },
  notifRow: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"12px 16px", background:"#fafafa", borderRadius:10,
    marginBottom:8, border:"1px solid #f1f5f9",
  },
  notifSuccess: {
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    background:"#dcfce7", color:"#15803d", padding:"12px 20px",
    borderRadius:10, marginTop:14, fontWeight:600, fontSize:14,
  },

  // ── PROGRESS BAR ────────────────────────────────────────────────────────
  progressWrap: { background:"#f1f5f9", borderRadius:8, height:8, overflow:"hidden" },
  progressBar: (pct, color="#6366f1") => ({
    height:"100%", width:`${pct}%`,
    background:`linear-gradient(90deg, ${color}, ${color}cc)`,
    borderRadius:8, transition:"width 0.6s ease",
  }),

  // ── EMPTY STATE ─────────────────────────────────────────────────────────
  emptyState: {
    padding:"60px 20px", textAlign:"center", color:"#94a3b8",
    display:"flex", flexDirection:"column", alignItems:"center", gap:12,
  },
};