// theme.js — ElecPay Design System (Geist/Vercel Inspired)
export const S = {

  // —— LOGIN ——
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
  inputDark: {
    width:"100%", padding:"12px 14px", borderRadius:11,
    border:"1.5px solid rgba(255,255,255,0.08)",
    background:"rgba(15,23,42,0.9)",
    color:"#e2e8f0",
    fontSize:14, boxSizing:"border-box", outline:"none",
    transition:"border-color 0.2s, box-shadow 0.2s",
    fontFamily:"inherit",
    colorScheme:"dark",
  },
  inputDarkFocus: {
    borderColor:"rgba(99,102,241,0.6)",
    boxShadow:"0 0 0 3px rgba(99,102,241,0.15)",
    background:"rgba(15,23,42,0.95)",
  },
  errMsg: {
    color:"#dc2626", fontSize:13, marginTop:8, fontWeight:500,
    display:"flex", alignItems:"center", gap:6,
  },
  errBox: {
    display:"flex", alignItems:"center", gap:8,
    background:"rgba(239,68,68,0.12)",
    border:"1px solid rgba(239,68,68,0.2)",
    borderRadius:10, padding:"10px 14px",
    color:"#fca5a5", fontSize:13, fontWeight:500,
    marginTop:8, textAlign:"left",
  },
  loginBtn: {
    width:"100%", padding:"14px", borderRadius:10, border:"none",
    background:"linear-gradient(135deg, #6366f1, #4f46e5)",
    color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    transition:"all 0.2s", boxShadow:"0 4px 14px rgba(99,102,241,0.3)",
    letterSpacing:"-0.01em", fontFamily:"inherit",
  },

  // —— COLORS ——
  colors: {
    primary: "#0070f3",
    primaryHover: "#0062d1",
    black: "#000000",
    white: "#ffffff",
    gray50: "#fafafa",
    gray100: "#f5f5f5",
    gray200: "#eaeaea",
    gray300: "#999999",
    gray400: "#888888",
    gray500: "#666666",
    gray600: "#444444",
    gray700: "#333333",
    gray800: "#111111",
    success: "#0070f3",
    successGreen: "#10b981",
    error: "#ee0000",
    warning: "#f5a623",
  },

  // —— APP SHELL ——
  appWrap: {
    display: "flex",
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    color: "#000000",
  },

  // —— SIDEBAR ——
  sidebar: {
    width: 240,
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    zIndex: 50,
    flexShrink: 0,
    borderRight: "1px solid #eaeaea",
  },
  sidebarLogo: {
    padding: "32px 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  sidebarLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarLogoText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#000",
    letterSpacing: "-0.02em",
  },
  sidebarLogoSub: {
    display: "none",
  },
  sidebarNav: {
    flex: 1,
    padding: "0 12px",
  },
  sidebarSection: {
    fontSize: 11,
    fontWeight: 500,
    color: "#888",
    textTransform: "uppercase",
    padding: "0 12px",
    marginBottom: 8,
    marginTop: 24,
    letterSpacing: "0.05em",
  },
  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center", gap: 10,
    padding: "8px 12px", borderRadius: 6, border: "none",
    background: "transparent", color: "#666", cursor: "pointer",
    fontSize: 14, fontWeight: 500, textAlign: "left", marginBottom: 2,
    transition: "all 0.15s ease", fontFamily: "inherit",
  },
  navItemActive: {
    background: "#fafafa", color: "#000", fontWeight: 600,
    boxShadow: "0 0 0 1px #eaeaea",
  },
  navDot: {
    display: "none",
  },
  sidebarFooter: {
    padding: "20px 12px", borderTop: "1px solid #eaeaea",
  },
  userCard: {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
    borderRadius: 6, background: "transparent", marginBottom: 12,
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%", background: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0,
    border: "1px solid #eaeaea",
  },
  avatarLg: {
    width: 64, height: 64, borderRadius: "50%", background: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24, fontWeight: 700, color: "#fff", flexShrink: 0,
    border: "1px solid #eaeaea",
  },
  logoutBtn: {
    width: "100%", padding: "8px 12px", borderRadius: 6,
    border: "1px solid #eaeaea", background: "#fff", color: "#666",
    cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, fontWeight: 500, transition: "all 0.2s",
    fontFamily: "inherit",
  },

  // —— MAIN ——
  main: {
    flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff",
  },
  header: {
    height: 64, padding: "0 32px", background: "#fff",
    borderBottom: "1px solid #eaeaea", display: "flex",
    alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 40,
  },
  pageTitle: {
    margin: 0, fontSize: 24, fontWeight: 700, color: "#000", letterSpacing: "-0.03em",
  },
  pageSub: {
    margin: "4px 0 0", fontSize: 14, color: "#888", fontWeight: 400,
  },
  content: {
    padding: "40px 32px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box",
  },

  // —— DASHBOARD COMPONENTS ——
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40,
  },
  statCard: {
    background: "#fff", borderRadius: 8, padding: "24px",
    border: "1px solid #eaeaea", display: "flex", flexDirection: "column", transition: "border-color 0.2s ease",
  },
  statIconWrap: {
    width: 32, height: 32, borderRadius: 6, display: "flex",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
    border: "1px solid #eaeaea", background: "#fafafa",
  },
  statValue: {
    fontSize: 32, fontWeight: 700, color: "#000", lineHeight: 1, letterSpacing: "-0.04em",
  },
  statLabel: {
    fontSize: 14, fontWeight: 500, color: "#888", marginTop: 8,
  },

  tableCard: {
    background: "#fff", borderRadius: 8, border: "1px solid #eaeaea",
    overflow: "hidden", marginBottom: 32,
  },
  tableHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", borderBottom: "1px solid #eaeaea",
  },
  tableTitle: {
    margin: 0, fontSize: 18, fontWeight: 600, color: "#000",
  },
  tableHead: {
    display: "grid", background: "#fafafa", padding: "12px 24px",
    borderBottom: "1px solid #eaeaea", fontSize: 12, fontWeight: 500,
    color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  tableRow: {
    display: "grid", padding: "16px 24px", borderBottom: "1px solid #eaeaea",
    alignItems: "center", transition: "background 0.1s ease", fontSize: 14, color: "#444",
  },

  // —— BUTTONS ——
  btnPrimary: {
    padding: "10px 24px", borderRadius: 6, border: "none",
    background: "#000", color: "#fff", fontWeight: 500, cursor: "pointer",
    fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.2s", fontFamily: "inherit",
  },
  btnOutline: {
    padding: "10px 24px", borderRadius: 6, border: "1px solid #eaeaea",
    background: "#fff", color: "#000", fontWeight: 500, cursor: "pointer",
    fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.2s", fontFamily: "inherit",
  },

  // —— BADGES ——
  badgePaye: {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px",
    borderRadius: 99, fontSize: 12, fontWeight: 500, background: "#e6f6ff",
    color: "#0070f3", border: "1px solid #b3e0ff",
  },
  badgeNonPaye: {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px",
    borderRadius: 99, fontSize: 12, fontWeight: 500, background: "#fff0f0",
    color: "#ee0000", border: "1px solid #ffd1d1",
  },

  // —— PROFILE HERO ——
  profileHero: {
    borderRadius: 12, padding: "48px 40px", background: "#000",
    display: "flex", alignItems:"center", gap: 32, marginBottom: 40, color: "#fff",
  },
  heroName: {
    margin: 0, fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em",
  },
  heroSub: {
    margin: "8px 0 0", fontSize: 16, color: "#888",
  },

  // —— MODAL ——
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100, padding: 20,
  },
  modalCard: {
    background: "#fff", borderRadius: 12, padding: "32px", width: "100%",
    maxWidth: 480, boxShadow: "0 30px 60px rgba(0,0,0,0.12)", border: "1px solid #eaeaea",
  },
};
