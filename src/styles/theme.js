export const S = {
  // Login
  loginWrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", padding:20 },
  loginCard: { background:"#1e293b", borderRadius:24, padding:"40px 32px", width:"100%", maxWidth:400, boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)", textAlign:"center", border:"1px solid rgba(255,255,255,0.05)" },
  loginIconWrap: { width:64, height:64, borderRadius:20, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:16 },
  loginTitle: { margin:0, fontSize:28, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.025em" },
  loginSub:   { color:"#94a3b8", marginTop:6, marginBottom:32, fontSize:15 },
  roleToggle: { display:"flex", gap:6, marginBottom:24, background:"#0f172a", borderRadius:14, padding:4 },
  roleBtn:    { flex:1, padding:"10px 0", borderRadius:10, border:"none", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" },
  roleBtnActive: { background:"#6366f1", color:"#fff", boxShadow:"0 4px 12px rgba(99,102,241,0.3)" },
  input:    { width:"100%", padding:"14px 16px", borderRadius:12, border:"1px solid #334155", background:"#0f172a", color:"#f1f5f9", fontSize:15, boxSizing:"border-box", outline:"none", marginBottom:12, transition:"border-color 0.2s" },
  errMsg:   { color:"#ef4444", fontSize:14, marginTop:-4, marginBottom:16, fontWeight:500 },
  loginBtn: { width:"100%", padding:"14px", borderRadius:12, border:"none", background:"#6366f1", color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" },

  // Layout
  appWrap:  { display:"flex", minHeight:"100vh", background:"#f8fafc" },
  
  // Sidebar
  sidebar:  { width:260, background:"#1e293b", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", zIndex:50, flexShrink:0 },
  sidebarLogo: { color:"#f8fafc", fontWeight:800, fontSize:22, padding:"32px 24px", display:"flex", alignItems:"center", gap:12 },
  sidebarLogoIcon: { width:36, height:36, borderRadius:10, background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center" },
  sidebarNav:    { flex:1, padding:"0 16px" },
  navItem:       { width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:12, border:"none", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:15, fontWeight:500, textAlign:"left", marginBottom:4, transition:"all 0.2s" },
  navItemActive: { background:"rgba(99,102,241,0.1)", color:"#6366f1", fontWeight:600 },
  sidebarFooter: { padding:"20px 16px", borderTop:"1px solid #334155", marginTop:"auto" },
  logoutBtn:  { width:"100%", padding:"12px", borderRadius:10, border:"1px solid #334155", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontWeight:600 },

  // Main
  main:       { flex:1, minWidth:0, display:"flex", flexDirection:"column" },
  header:     { height:72, padding:"0 32px", background:"#fff", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" },
  content:    { padding:"32px", maxWidth:1200, width:"100%", boxSizing:"border-box" },

  // Stats
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:20, marginBottom:32 },
  statCard:   { background:"#fff", borderRadius:20, padding:24, boxShadow:"0 1px 3px rgba(0,0,0,0.1)", border:"1px solid #f1f5f9", display:"flex", flexDirection:"column" },
  statIcon:   { width:48, height:48, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 },
  statValue:  { fontSize:28, fontWeight:800, color:"#0f172a", lineHeight:1 },
  statLabel:  { fontSize:14, fontWeight:600, color:"#64748b", marginTop:8 },

  // Tables
  tableCard:  { background:"#fff", borderRadius:20, boxShadow:"0 1px 3px rgba(0,0,0,0.1)", border:"1px solid #f1f5f9", overflow:"hidden" },
  tableHead:  { display:"grid", background:"#f8fafc", padding:"14px 24px", borderBottom:"1px solid #f1f5f9" },
  tableRow:   { display:"grid", padding:"16px 24px", borderBottom:"1px solid #f1f5f9", alignItems:"center", transition:"background 0.2s" },
  
  // Buttons
  btnPrimary: { padding:"10px 20px", borderRadius:10, border:"none", background:"#6366f1", color:"#fff", fontWeight:600, cursor:"pointer", fontSize:14, display:"inline-flex", alignItems:"center", gap:8 },
  btnSmallGreen: { padding:"6px 12px", borderRadius:8, border:"none", background:"#dcfce7", color:"#166534", fontWeight:700, cursor:"pointer", fontSize:12, display:"inline-flex", alignItems:"center", gap:4 },
  btnSmallBlue:  { padding:"6px 12px", borderRadius:8, border:"none", background:"#e0e7ff", color:"#4338ca", fontWeight:700, cursor:"pointer", fontSize:12, display:"inline-flex", alignItems:"center", gap:4 },
  btnSmallRed:   { padding:"6px 12px", borderRadius:8, border:"none", background:"#fee2e2", color:"#b91c1c", fontWeight:700, cursor:"pointer", fontSize:12, display:"inline-flex", alignItems:"center", gap:4 },

  // Modal
  overlay:    { position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 },
  modalCard:  { background:"#fff", borderRadius:24, padding:32, width:"100%", maxWidth:450, boxShadow:"0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalInput: { width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:15, color:"#0f172a", outline:"none", boxSizing:"border-box", marginTop:6 },
};
