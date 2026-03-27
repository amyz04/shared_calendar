import { useState } from 'react'
import { DARK, LIGHT } from './theme'
import { INIT_TRIPS } from './data'
import type { NavId, Trip, CalendarSource, AuthMode } from './types'
import { Sidebar } from './components/Sidebar'
import { LoginPage } from './components/LoginPage'
import { CalendarPage } from './components/CalendarPage'
import { TripsPage } from './components/TripsPage'
import { FriendsPage } from './components/FriendsPage'
import { ProfilePanel } from './components/ProfilePanel'
import { NewTripModal } from './components/NewTripModal'

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [view, setView] = useState<NavId>("trips");
  const [trips, setTrips] = useState<Trip[]>(INIT_TRIPS);
  const [activeTripId, setActive] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);

  const calendarsSynced = calendars.length > 0;
  const isGuest = authMode === "guest";
  const T = isDark ? DARK : LIGHT;

  const handleCreate = (data: Omit<Trip, "id" | "status">) => {
    const id = Math.max(...trips.map(t => t.id)) + 1;
    setTrips(p => [...p, { id, status: "planning", ...data }]);
    setActive(id); setView("calendar");
  };

  if (!authMode) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body,#root{height:100%;}
          body{font-family:'Syne',sans-serif;}
          input,button{font-family:'Syne',sans-serif;}
          ::placeholder{color:${T.textLo};}
          button{transition:all 0.15s;}
        `}</style>
        <LoginPage T={T} isDark={isDark} toggleTheme={() => setIsDark(d => !d)} onAuth={setAuthMode} />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;}
        body{background:${T.bg};color:${T.text};font-family:'Syne',sans-serif;}
        input,select,button,textarea{font-family:'Syne',sans-serif;}
        select option{background:${T.card};color:${T.text};}
        input[type="date"]{color-scheme:${isDark ? "dark" : "light"};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:${T.scrollbar};border-radius:4px;}
        ::placeholder{color:${T.textLo};}
        button{transition:all 0.15s;}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>

      {showModal && !isGuest && (
        <NewTripModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          T={T}
        />
      )}
      {showProfile && !isGuest && (
        <ProfilePanel
          onClose={() => setShowProfile(false)}
          calendars={calendars}
          onAddCalendar={c => setCalendars(p => [...p, c])}
          onRemoveCalendar={id => setCalendars(p => p.filter(c => c.id !== id))}
          T={T}
        />
      )}

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar
          active={view} onNav={setView} trips={trips}
          activeTripId={activeTripId} onSelectTrip={setActive}
          onNewTrip={() => !isGuest && setShowModal(true)}
          onOpenProfile={() => !isGuest && setShowProfile(true)}
          T={T} isDark={isDark} toggleTheme={() => setIsDark(d => !d)}
          isGuest={isGuest}
          onSignIn={() => setAuthMode(null)}
        />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px", background: T.bgAlt }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32, gap: 10 }}>
            {isGuest && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: `${T.amber}15`, border: `1px solid ${T.amber}40`, fontSize: 11, color: T.amber, fontFamily: "'Syne',sans-serif" }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} /></svg>
                Guest mode
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: T.surface, border: `1px solid ${T.border}`, fontSize: 11, color: T.textMd, fontFamily: "'Syne',sans-serif" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
              Spring Boot · connected
            </div>
            {!isGuest && (
              <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                New trip
              </button>
            )}
          </div>

          {view === "trips" && (
            <TripsPage
              trips={trips}
              onSelectTrip={setActive}
              onNewTrip={() => setShowModal(true)}
              onNav={setView}
              T={T}
              isGuest={isGuest}
            />
          )}
          {view === "calendar" && (
            <CalendarPage
              trips={trips}
              activeTripId={activeTripId}
              onSelectTrip={setActive}
              onOpenProfile={() => isGuest ? setAuthMode(null) : setShowProfile(true)}
              calendarsSynced={calendarsSynced}
              T={T}
              isGuest={isGuest}
            />
          )}
          {view === "friends" && (
            <FriendsPage
              trips={trips}
              T={T}
              isGuest={isGuest}
            />
          )}
        </main>
      </div>
    </>
  );
}