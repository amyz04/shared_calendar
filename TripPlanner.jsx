// import { useState, useMemo } from "react";

// const C = {
//   bg:"#0c1015", surface:"#13181f", card:"#181f29", border:"#242d3a",
//   borderHi:"#3a4d62", teal:"#2dd4bf", tealDim:"#0f6e5e", amber:"#f59e0b",
//   coral:"#f87171", purple:"#a78bfa", text:"#e2eaf3", muted:"#7a8fa6", hint:"#3d4f62",
// };

// const FRIEND_POOL = [
//   { id:1,  name:"Alex Lee",   initials:"AL", color:"#7c6fcd", email:"alex@email.com"   },
//   { id:2,  name:"Jordan M",   initials:"JM", color:"#f87171", email:"jordan@email.com" },
//   { id:3,  name:"Sam K",      initials:"SK", color:"#f59e0b", email:"sam@email.com"    },
//   { id:4,  name:"Priya R",    initials:"PR", color:"#34d399", email:"priya@email.com"  },
//   { id:5,  name:"Chris B",    initials:"CB", color:"#60a5fa", email:"chris@email.com"  },
//   { id:6,  name:"Maya T",     initials:"MT", color:"#f472b6", email:"maya@email.com"   },
//   { id:7,  name:"Devon W",    initials:"DW", color:"#fb923c", email:"devon@email.com"  },
//   { id:8,  name:"Riley S",    initials:"RS", color:"#a78bfa", email:"riley@email.com"  },
//   { id:9,  name:"Jamie O",    initials:"JO", color:"#4ade80", email:"jamie@email.com"  },
//   { id:10, name:"Taylor N",   initials:"TN", color:"#38bdf8", email:"taylor@email.com" },
// ];

// function genMonthBusy(seed, year, month) {
//   const days = new Date(year, month + 1, 0).getDate();
//   const busy = {};
//   let r = seed * 1234567;
//   const rand = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
//   for (let d = 1; d <= days; d++) {
//     busy[d] = [];
//     const n = Math.floor(rand() * 3);
//     const used = [];
//     for (let i = 0; i < n; i++) {
//       const s = 8 + Math.floor(rand() * 9);
//       const e = Math.min(s + 1 + Math.floor(rand() * 2.5), 18);
//       if (!used.some(([us, ue]) => s < ue && e > us)) { used.push([s, e]); busy[d].push({ s, e }); }
//     }
//   }
//   return busy;
// }

// const INIT_TRIPS = [
//   { id:1, name:"Portugal Summer", dest:"Lisbon",     cover:"🇵🇹", year:2025, month:5, memberIds:[1,2,3,4,5],    status:"planning"  },
//   { id:2, name:"NYC Weekend",     dest:"New York",   cover:"🗽",  year:2025, month:6, memberIds:[1,6,7,8],      status:"planning"  },
//   { id:3, name:"Alps Ski Week",   dest:"Innsbruck",  cover:"🏔️", year:2026, month:1, memberIds:[2,3,9,10],     status:"confirmed" },
// ];

// const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
// const firstDow    = (y, m) => new Date(y, m, 1).getDay();
// const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const DAY_ABBR    = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// function mergeIntervals(ivs) {
//   if (!ivs.length) return [];
//   const s = [...ivs].sort((a, b) => a.s - b.s);
//   const m = [{ ...s[0] }];
//   for (let i = 1; i < s.length; i++) {
//     const l = m[m.length - 1];
//     if (s[i].s <= l.e) l.e = Math.max(l.e, s[i].e); else m.push({ ...s[i] });
//   }
//   return m;
// }

// function getFreeSlots(allBusy, s0 = 8, e0 = 18) {
//   const m = mergeIntervals(allBusy);
//   const free = []; let cur = s0;
//   for (const { s, e } of m) { if (s > cur) free.push({ s: cur, e: s }); cur = Math.max(cur, e); }
//   if (cur < e0) free.push({ s: cur, e: e0 });
//   return free.filter(f => f.e - f.s >= 0.5);
// }

// function computeWindows(members, allBusy, year, month) {
//   const days = daysInMonth(year, month);
//   const results = [];
//   for (let start = 1; start <= days - 1; start++) {
//     for (let len = 2; len <= Math.min(8, days - start + 1); len++) {
//       const end = start + len - 1;
//       const freeNames = [], conflicts = [];
//       members.forEach(f => {
//         let blocked = false;
//         for (let d = start; d <= end; d++) { if ((allBusy[f.id]?.[d] || []).length >= 2) { blocked = true; break; } }
//         if (!blocked) freeNames.push(f.name.split(" ")[0]); else conflicts.push(f.name.split(" ")[0]);
//       });
//       const count = freeNames.length;
//       if (count >= Math.ceil(members.length * 0.6)) {
//         results.push({ start, end, len, count, total: members.length, freeNames, conflicts, score: Math.round((count / members.length) * 70 + (len / 7) * 30) });
//       }
//     }
//   }
//   results.sort((a, b) => b.score - a.score || b.count - a.count || b.len - a.len);
//   const seen = new Set();
//   return results.filter(w => { const k = `${w.start}-${w.end}`; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
// }

// const Avatar = ({ f, size = 28 }) => (
//   <div style={{ width:size, height:size, borderRadius:"50%", background:`${f.color}22`, border:`1.5px solid ${f.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.34, fontWeight:700, color:f.color, fontFamily:"'DM Mono',monospace", flexShrink:0 }}>{f.initials}</div>
// );

// const Badge = ({ children, color="#2dd4bf", small }) => (
//   <span style={{ fontSize:small?10:11, padding:small?"1px 6px":"2px 9px", borderRadius:20, background:`${color}18`, border:`1px solid ${color}40`, color, fontWeight:500, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>{children}</span>
// );

// const ScoreRing = ({ score }) => {
//   const r = 16, circ = 2 * Math.PI * r, fill = (score / 100) * circ;
//   const col = score > 80 ? C.teal : score > 60 ? C.amber : C.coral;
//   return (
//     <svg width={40} height={40} style={{ flexShrink:0 }}>
//       <circle cx={20} cy={20} r={r} fill="none" stroke={C.border} strokeWidth={3}/>
//       <circle cx={20} cy={20} r={r} fill="none" stroke={col} strokeWidth={3}
//         strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 20 20)"/>
//       <text x={20} y={25} textAnchor="middle" fill={C.text} fontSize={10} fontWeight={700} fontFamily="'DM Mono',monospace">{score}</text>
//     </svg>
//   );
// };

// // ── Sidebar ───────────────────────────────────────────────────────────────────
// const NAV = [
//   { id:"trips",    label:"My Trips",  icon:"M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
//   { id:"calendar", label:"Calendar",  icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
//   { id:"friends",  label:"Friends",   icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
// ];

// function Sidebar({ active, onNav, trips, activeTripId, onSelectTrip, onNewTrip }) {
//   return (
//     <aside style={{ width:230, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
//       <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
//         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//           <div style={{ width:32, height:32, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
//             <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0c1015" strokeWidth={2.5} strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
//           </div>
//           <div>
//             <div style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"'DM Serif Display',serif" }}>Wander</div>
//             <div style={{ fontSize:10, color:C.muted, fontFamily:"'DM Mono',monospace" }}>group trip planner</div>
//           </div>
//         </div>
//       </div>

//       <nav style={{ padding:"12px 12px 0" }}>
//         {NAV.map(n => (
//           <button key={n.id} onClick={() => onNav(n.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:8, marginBottom:2, background:active===n.id?`${C.teal}14`:"transparent", border:`1px solid ${active===n.id?C.teal+"35":"transparent"}`, color:active===n.id?C.teal:C.muted, fontSize:13, fontWeight:active===n.id?600:400, cursor:"pointer", textAlign:"left" }}>
//             <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active===n.id?2:1.5} strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
//             {n.label}
//           </button>
//         ))}
//       </nav>

//       <div style={{ padding:"12px", flex:1, overflowY:"auto" }}>
//         <div style={{ fontSize:10, color:C.hint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:8 }}>TRIPS</div>
//         {trips.map(t => {
//           const members = t.memberIds.map(id => FRIEND_POOL.find(f => f.id===id)).filter(Boolean);
//           return (
//             <button key={t.id} onClick={() => { onSelectTrip(t.id); onNav("calendar"); }} style={{ width:"100%", padding:"9px 10px", borderRadius:10, marginBottom:5, background:activeTripId===t.id?`${C.teal}10`:"transparent", border:`1px solid ${activeTripId===t.id?C.teal+"30":C.border}`, cursor:"pointer", textAlign:"left" }}>
//               <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
//                 <span style={{ fontSize:18 }}>{t.cover}</span>
//                 <div style={{ flex:1, minWidth:0 }}>
//                   <div style={{ fontSize:12, fontWeight:600, color:activeTripId===t.id?C.teal:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
//                   <div style={{ fontSize:10, color:C.muted }}>{MONTH_NAMES[t.month].slice(0,3)} {t.year} · {members.length}p</div>
//                 </div>
//               </div>
//               <div style={{ display:"flex" }}>
//                 {members.slice(0,5).map((f,i) => f && <div key={f.id} style={{ marginLeft:i===0?0:-7, zIndex:members.length-i }}><Avatar f={f} size={20}/></div>)}
//                 {members.length>5 && <div style={{ width:20, height:20, borderRadius:"50%", background:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.muted, marginLeft:-7 }}>+{members.length-5}</div>}
//               </div>
//             </button>
//           );
//         })}
//         <button onClick={onNewTrip} style={{ width:"100%", padding:"7px 0", borderRadius:8, marginTop:4, background:"transparent", border:`1px dashed ${C.border}`, color:C.hint, fontSize:11, cursor:"pointer", fontFamily:"'DM Mono',monospace" }}>+ new trip</button>
//       </div>

//       <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.border}` }}>
//         <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//           <Avatar f={FRIEND_POOL[0]} size={30}/>
//           <div>
//             <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Alex Lee</div>
//             <div style={{ fontSize:10, color:C.muted }}>alex@email.com</div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// // ── New Trip Modal ─────────────────────────────────────────────────────────────
// function NewTripModal({ onClose, onCreate }) {
//   const [name, setName]     = useState("");
//   const [dest, setDest]     = useState("");
//   const [cover, setCover]   = useState("✈️");
//   const [month, setMonth]   = useState(5);
//   const [year, setYear]     = useState(2025);
//   const [selected, setSelected] = useState([1]);
//   const EMOJIS = ["✈️","🇵🇹","🏔️","🗽","🏖️","🌸","🎿","🏝️","🌍","🍣","🏕️","🎭"];

//   const toggle = id => { if (id===1) return; setSelected(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]); };

//   return (
//     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
//       <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:18, padding:28, width:520, maxHeight:"88vh", overflowY:"auto" }}>
//         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
//           <h2 style={{ fontSize:20, fontWeight:700, color:C.text, fontFamily:"'DM Serif Display',serif", margin:0 }}>Plan a new trip</h2>
//           <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:22, cursor:"pointer", lineHeight:1 }}>×</button>
//         </div>

//         {/* emoji row */}
//         <div style={{ marginBottom:18 }}>
//           <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>TRIP ICON</div>
//           <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
//             {EMOJIS.map(e => <button key={e} onClick={() => setCover(e)} style={{ width:36, height:36, borderRadius:8, fontSize:18, cursor:"pointer", background:cover===e?`${C.teal}20`:C.surface, border:`1px solid ${cover===e?C.teal:C.border}` }}>{e}</button>)}
//           </div>
//         </div>

//         {[["TRIP NAME", name, setName, "e.g. Portugal Summer"], ["DESTINATION", dest, setDest, "e.g. Lisbon"]].map(([lbl,val,set,ph]) => (
//           <div key={lbl} style={{ marginBottom:14 }}>
//             <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{lbl}</div>
//             <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{ width:"100%", padding:"9px 12px", borderRadius:9, fontSize:13, background:C.surface, border:`1px solid ${C.border}`, color:C.text, outline:"none" }}/>
//           </div>
//         ))}

//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
//           {[["MONTH", month, setMonth, MONTH_NAMES.map((m,i)=>({v:i,l:m}))],
//             ["YEAR",  year,  setYear,  [{v:2025,l:"2025"},{v:2026,l:"2026"},{v:2027,l:"2027"}]]].map(([lbl,val,set,opts]) => (
//             <div key={lbl}>
//               <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{lbl}</div>
//               <select value={val} onChange={e=>set(+e.target.value)} style={{ width:"100%", padding:"9px 12px", borderRadius:9, fontSize:13, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}>
//                 {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
//               </select>
//             </div>
//           ))}
//         </div>

//         {/* friend picker */}
//         <div style={{ marginBottom:22 }}>
//           <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>INVITE FRIENDS — pick anyone from your pool</div>
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, maxHeight:260, overflowY:"auto" }}>
//             {FRIEND_POOL.map(f => {
//               const on = selected.includes(f.id);
//               return (
//                 <button key={f.id} onClick={() => toggle(f.id)} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:9, cursor:f.id===1?"default":"pointer", background:on?`${f.color}12`:C.surface, border:`1px solid ${on?f.color+"45":C.border}`, textAlign:"left" }}>
//                   <Avatar f={f} size={26}/>
//                   <div style={{ flex:1 }}>
//                     <div style={{ fontSize:12, fontWeight:500, color:on?f.color:C.text }}>{f.name}</div>
//                     <div style={{ fontSize:10, color:C.hint }}>{f.id===1?"you (organizer)":f.email.split("@")[0]}</div>
//                   </div>
//                   {on && <div style={{ width:16, height:16, borderRadius:"50%", background:f.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//                     <svg width={9} height={9} viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth={2}><path d="M2 5l2 2 4-4"/></svg>
//                   </div>}
//                 </button>
//               );
//             })}
//           </div>
//           {/* selected pills */}
//           {selected.length > 0 && (
//             <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10 }}>
//               {selected.map(id => { const f = FRIEND_POOL.find(x=>x.id===id); return f ? <div key={id} style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px 3px 4px", borderRadius:20, background:`${f.color}15`, border:`1px solid ${f.color}35` }}><div style={{ width:16, height:16, borderRadius:"50%", background:f.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#fff", fontWeight:700 }}>{f.initials[0]}</div><span style={{ fontSize:11, color:f.color, fontFamily:"'DM Mono',monospace" }}>{f.name.split(" ")[0]}</span>{f.id!==1&&<button onClick={()=>toggle(id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:12, lineHeight:1, padding:0 }}>×</button>}</div> : null; })}
//             </div>
//           )}
//         </div>

//         <button onClick={() => { if (!name||!dest) return; onCreate({ name, dest, cover, month, year, memberIds:selected }); onClose(); }} style={{ width:"100%", padding:"11px 0", borderRadius:10, fontSize:14, background:(!name||!dest)?C.border:C.teal, border:"none", color:(!name||!dest)?C.muted:C.bg, fontWeight:700, cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"all .2s" }}>
//           Create trip &amp; send calendar invites →
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Monthly Calendar ──────────────────────────────────────────────────────────
// function MonthCalendar({ trip, allBusy }) {
//   const [selectedDay, setSelectedDay] = useState(null);
//   const { year, month } = trip;
//   const members = trip.memberIds.map(id => FRIEND_POOL.find(f=>f.id===id)).filter(Boolean);
//   const days = daysInMonth(year, month);
//   const fdow = firstDow(year, month);
//   const fmt  = h => h>=13?`${h-12}pm`:`${h}am`;

//   const cellData = useMemo(() => {
//     const out = {};
//     for (let d = 1; d <= days; d++) {
//       const memberBusy = members.map(f => ({ f, blocks: allBusy[f.id]?.[d] || [] }));
//       const allBlocks  = memberBusy.flatMap(mb => mb.blocks);
//       const freeSlots  = getFreeSlots(allBlocks);
//       const fullyFree  = members.filter(f => (allBusy[f.id]?.[d]||[]).length===0);
//       out[d] = { memberBusy, freeSlots, fullyFree };
//     }
//     return out;
//   }, [trip.id]);

//   const getStyle = d => {
//     const r = cellData[d].fullyFree.length / members.length;
//     if (r===1) return { bg:`${C.teal}1e`, bdr:`${C.teal}50`, dot:C.teal };
//     if (r>=0.6) return { bg:`${C.amber}18`, bdr:`${C.amber}45`, dot:C.amber };
//     return { bg:`${C.coral}10`, bdr:`${C.coral}35`, dot:C.coral };
//   };

//   const sel = selectedDay && cellData[selectedDay];

//   return (
//     <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:16 }}>
//       {/* grid */}
//       <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
//         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
//           <div>
//             <h3 style={{ fontSize:18, fontWeight:700, color:C.text, fontFamily:"'DM Serif Display',serif", margin:0 }}>{MONTH_NAMES[month]} {year}</h3>
//             <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{trip.name} · {members.length} people</div>
//           </div>
//           <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//             {[[C.teal,"All free"],[C.amber,"Most free"],[C.coral,"Conflicts"]].map(([c,l])=>(
//               <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted }}>
//                 <div style={{ width:10, height:10, borderRadius:2, background:`${c}40`, border:`1px solid ${c}` }}/>{l}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
//           {DAY_ABBR.map(d=><div key={d} style={{ textAlign:"center", fontSize:11, color:C.hint, fontFamily:"'DM Mono',monospace" }}>{d}</div>)}
//         </div>
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
//           {Array.from({length:fdow},(_,i)=><div key={`e${i}`}/>)}
//           {Array.from({length:days},(_,i)=>{
//             const d=i+1, col=getStyle(d), data=cellData[d], isSel=selectedDay===d;
//             return (
//               <button key={d} onClick={()=>setSelectedDay(isSel?null:d)}
//                 style={{ aspectRatio:"1", borderRadius:9, cursor:"pointer", background:isSel?col.bdr:col.bg, border:`1.5px solid ${isSel?col.dot:col.bdr}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, transition:"all .1s" }}>
//                 <span style={{ fontSize:13, fontWeight:isSel?700:500, color:isSel?C.bg:C.text }}>{d}</span>
//                 <div style={{ display:"flex", gap:1.5 }}>
//                   {data.fullyFree.slice(0,4).map(f=><div key={f.id} style={{ width:4, height:4, borderRadius:"50%", background:f.color }}/>)}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* side panel */}
//       <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//         {sel ? (
//           <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:16, padding:18 }}>
//             <div style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"'DM Serif Display',serif", marginBottom:2 }}>{MONTH_NAMES[month]} {selectedDay}</div>
//             <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>{sel.fullyFree.length}/{members.length} fully free</div>
//             {sel.memberBusy.map(({f,blocks})=>(
//               <div key={f.id} style={{ marginBottom:10 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
//                   <Avatar f={f} size={20}/>
//                   <span style={{ fontSize:12, color:blocks.length===0?f.color:C.muted, fontWeight:blocks.length===0?600:400 }}>{f.name.split(" ")[0]}</span>
//                   {blocks.length===0 && <Badge color={f.color} small>free</Badge>}
//                 </div>
//                 <div style={{ height:16, background:C.surface, borderRadius:4, position:"relative", overflow:"hidden" }}>
//                   {blocks.length===0 && <div style={{ position:"absolute", inset:0, background:`${f.color}15` }}/>}
//                   {blocks.map((b,bi)=>{ const tot=10,l=((b.s-8)/tot)*100,w=((b.e-b.s)/tot)*100; return <div key={bi} style={{ position:"absolute", left:`${l}%`, width:`${w}%`, height:"100%", background:`${f.color}40`, borderRadius:2 }}/>; })}
//                 </div>
//               </div>
//             ))}
//             {sel.freeSlots.length>0 && (
//               <div style={{ marginTop:12, padding:"10px 12px", borderRadius:9, background:`${C.teal}0c`, border:`1px solid ${C.teal}25` }}>
//                 <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>SHARED FREE WINDOWS</div>
//                 {sel.freeSlots.map((sl,i)=><div key={i} style={{ fontSize:12, color:C.teal, marginBottom:2 }}>{fmt(sl.s)} – {fmt(sl.e)}</div>)}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18, textAlign:"center" }}>
//             <div style={{ fontSize:30, marginBottom:8 }}>📅</div>
//             <div style={{ fontSize:13, color:C.muted }}>Click any day to see who's free and shared time windows</div>
//           </div>
//         )}

//         {/* sync status */}
//         <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
//           <div style={{ fontSize:10, color:C.hint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:12 }}>CALENDAR SYNC — {MONTH_NAMES[month]}</div>
//           {members.map((f,i)=>{
//             const totalBusy = Object.values(allBusy[f.id]||{}).reduce((s,b)=>s+b.length,0);
//             const synced = i < members.length - 1;
//             return (
//               <div key={f.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:i<members.length-1?`1px solid ${C.border}`:"none" }}>
//                 <Avatar f={f} size={26}/>
//                 <div style={{ flex:1 }}>
//                   <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{f.name}</div>
//                   <div style={{ fontSize:10, color:C.muted }}>{synced?`${totalBusy} events this month`:"Invite sent"}</div>
//                 </div>
//                 <Badge color={synced?C.teal:C.amber} small>{synced?"synced":"pending"}</Badge>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Windows panel ─────────────────────────────────────────────────────────────
// function WindowsPanel({ trip, allBusy }) {
//   const members = trip.memberIds.map(id=>FRIEND_POOL.find(f=>f.id===id)).filter(Boolean);
//   const windows = useMemo(()=>computeWindows(members,allBusy,trip.year,trip.month),[trip.id]);
//   return (
//     <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginTop:14 }}>
//       <div style={{ fontSize:11, color:C.hint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:14 }}>
//         COMPUTED WINDOWS · POST /api/calendar/availability/windows
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
//         {windows.map((w,i)=>(
//           <div key={i} style={{ padding:"12px 14px", borderRadius:12, cursor:"pointer", background:i===0?`${C.teal}0e`:C.surface, border:`1px solid ${i===0?C.teal+"40":C.border}` }}>
//             {i===0 && <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace", marginBottom:5 }}>BEST MATCH</div>}
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
//               <div>
//                 <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{MONTH_NAMES[trip.month].slice(0,3)} {w.start}–{w.end}</div>
//                 <div style={{ fontSize:11, color:C.muted }}>{w.len} days · {w.count}/{w.total} free</div>
//               </div>
//               <ScoreRing score={w.score}/>
//             </div>
//             <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
//               {w.freeNames.map(n=>{ const f=FRIEND_POOL.find(x=>x.name.startsWith(n)); return f?<Badge key={n} color={f.color} small>{n}</Badge>:null; })}
//             </div>
//             {w.conflicts.length>0 && <div style={{ fontSize:10, color:C.coral, marginTop:5 }}>{w.conflicts.join(", ")} busy</div>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Calendar page ─────────────────────────────────────────────────────────────
// function CalendarPage({ trips, activeTripId, onSelectTrip }) {
//   const trip = trips.find(t=>t.id===activeTripId)||trips[0];
//   const members = trip.memberIds.map(id=>FRIEND_POOL.find(f=>f.id===id)).filter(Boolean);
//   const allBusy = useMemo(()=>{
//     const out={};
//     members.forEach(f=>{ out[f.id]=genMonthBusy(f.id*31+trip.id*7, trip.year, trip.month); });
//     return out;
//   },[trip.id]);

//   return (
//     <div>
//       <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
//         {trips.map(t=>(
//           <button key={t.id} onClick={()=>onSelectTrip(t.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:500, background:activeTripId===t.id?`${C.teal}18`:"transparent", border:`1px solid ${activeTripId===t.id?C.teal+"50":C.border}`, color:activeTripId===t.id?C.teal:C.muted }}>
//             <span style={{ fontSize:14 }}>{t.cover}</span>{t.name}
//             <span style={{ fontSize:10, color:activeTripId===t.id?C.teal:C.hint }}>{t.memberIds.length}p</span>
//           </button>
//         ))}
//       </div>
//       <MonthCalendar trip={trip} allBusy={allBusy}/>
//       <WindowsPanel trip={trip} allBusy={allBusy}/>
//     </div>
//   );
// }

// // ── Trips page ────────────────────────────────────────────────────────────────
// function TripsPage({ trips, onSelectTrip, onNewTrip, onNav }) {
//   return (
//     <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
//       {trips.map(t=>{
//         const members=t.memberIds.map(id=>FRIEND_POOL.find(f=>f.id===id)).filter(Boolean);
//         return (
//           <div key={t.id} onClick={()=>{ onSelectTrip(t.id); onNav("calendar"); }}
//             style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, cursor:"pointer" }}
//             onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi}
//             onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
//             <div style={{ fontSize:32, marginBottom:10 }}>{t.cover}</div>
//             <div style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"'DM Serif Display',serif", marginBottom:2 }}>{t.name}</div>
//             <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>{t.dest} · {MONTH_NAMES[t.month]} {t.year}</div>
//             <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
//               {members.slice(0,6).map((f,i)=><div key={f.id} style={{ marginLeft:i===0?0:-8, zIndex:members.length-i }}><Avatar f={f} size={28}/></div>)}
//               {members.length>6 && <div style={{ marginLeft:-8, width:28, height:28, borderRadius:"50%", background:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.muted }}>+{members.length-6}</div>}
//               <span style={{ fontSize:11, color:C.muted, marginLeft:10 }}>{members.length} going</span>
//             </div>
//             <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
//               <Badge color={t.status==="confirmed"?C.teal:C.amber}>{t.status}</Badge>
//               <Badge color={C.muted} small>{t.memberIds.length} members</Badge>
//             </div>
//           </div>
//         );
//       })}
//       <button onClick={onNewTrip}
//         style={{ background:"transparent", border:`1.5px dashed ${C.border}`, borderRadius:16, padding:20, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, minHeight:200, color:C.muted, fontSize:13 }}
//         onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.teal; e.currentTarget.style.color=C.teal; }}
//         onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; }}>
//         <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
//         Plan new trip
//       </button>
//     </div>
//   );
// }

// // ── Friends page ──────────────────────────────────────────────────────────────
// function FriendsPage({ trips }) {
//   return (
//     <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
//       {FRIEND_POOL.map(f=>{
//         const sharedTrips=trips.filter(t=>t.memberIds.includes(f.id));
//         return (
//           <div key={f.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
//             <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
//               <Avatar f={f} size={42}/>
//               <div>
//                 <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{f.name}</div>
//                 <div style={{ fontSize:11, color:C.muted }}>{f.email}</div>
//               </div>
//             </div>
//             <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
//               <Badge color={C.teal} small>{sharedTrips.length} trip{sharedTrips.length!==1?"s":""}</Badge>
//               <Badge color={f.id<6?C.teal:C.amber} small>{f.id<6?"cal synced":"not synced"}</Badge>
//             </div>
//             <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
//               {sharedTrips.map(t=><span key={t.id} style={{ fontSize:18 }}>{t.cover}</span>)}
//             </div>
//           </div>
//         );
//       })}
//       <button style={{ background:"transparent", border:`1.5px dashed ${C.border}`, borderRadius:14, padding:18, cursor:"pointer", color:C.muted, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8, minHeight:140 }}>
//         <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
//         Add friend
//       </button>
//     </div>
//   );
// }

// // ── Root ──────────────────────────────────────────────────────────────────────
// export default function App() {
//   const [view, setView]           = useState("trips");
//   const [trips, setTrips]         = useState(INIT_TRIPS);
//   const [activeTripId, setActive] = useState(1);
//   const [showModal, setShowModal] = useState(false);

//   const PAGE = { trips:["My Trips","All group trips"], calendar:["Availability","Monthly calendar merge · GET /api/calendar/freebusy"], friends:["Friends","Your travel crew"] };

//   const handleCreate = data => {
//     const id = Math.max(...trips.map(t=>t.id)) + 1;
//     setTrips(p=>[...p, { id, status:"planning", ...data }]);
//     setActive(id); setView("calendar");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
//         body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif}
//         input,select,button{font-family:'DM Sans',sans-serif}
//         select option{background:${C.card}}
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:${C.surface}}
//         ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
//       `}</style>

//       {showModal && <NewTripModal onClose={()=>setShowModal(false)} onCreate={handleCreate}/>}

//       <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
//         <Sidebar active={view} onNav={setView} trips={trips} activeTripId={activeTripId} onSelectTrip={setActive} onNewTrip={()=>setShowModal(true)}/>

//         <main style={{ flex:1, overflowY:"auto", padding:"28px 30px" }}>
//           <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
//             <div>
//               <h2 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0, fontFamily:"'DM Serif Display',serif" }}>{PAGE[view][0]}</h2>
//               <div style={{ fontSize:11, color:C.muted, marginTop:2, fontFamily:"'DM Mono',monospace" }}>{PAGE[view][1]}</div>
//             </div>
//             <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//               <div style={{ fontSize:11, color:C.teal, padding:"4px 12px", borderRadius:20, background:`${C.teal}12`, border:`1px solid ${C.teal}30`, fontFamily:"'DM Mono',monospace" }}>Spring Boot · connected</div>
//               <button onClick={()=>setShowModal(true)} style={{ padding:"7px 16px", borderRadius:9, fontSize:12, cursor:"pointer", background:C.teal, border:"none", color:C.bg, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>+ new trip</button>
//             </div>
//           </div>

//           {view==="trips"    && <TripsPage trips={trips} onSelectTrip={setActive} onNewTrip={()=>setShowModal(true)} onNav={setView}/>}
//           {view==="calendar" && <CalendarPage trips={trips} activeTripId={activeTripId} onSelectTrip={setActive}/>}
//           {view==="friends"  && <FriendsPage trips={trips}/>}
//         </main>
//       </div>
//     </>
//   );
// }
