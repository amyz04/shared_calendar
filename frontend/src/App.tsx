import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useTrips } from "./context/TripContext";
import { useCalendars } from "./context/CalendarContext";
import { Sidebar } from "./components/sidebar/Sidebar";
import { LoginPage } from "./components/login/LoginPage";
import { TripsPage } from "./components/trips/TripsPage";
import { TripDetailPage } from "./components/trips/TripDetailPage";
import { FriendsPage } from "./components/friends/FriendsPage";
import { ProfilePanel } from "./components/profile/ProfilePanel";
import { NewTripModal } from "./components/trips/NewTripModal";
import { StatusBar } from "./components/ui/StatusBar";

export default function App() {
  const { isAuthenticated, isGuest, setAuthMode, logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const {
    trips,
    loading,
    activeTripId,
    setActiveTripId,
    showTripModal,
    openTripModal,
    closeTripModal,
    handleCreate,
  } = useTrips();
  const {
    calendars,
    calendarsSynced,
    showProfile,
    openProfile,
    closeProfile,
    addCalendar,
    removeCalendar,
  } = useCalendars();

  const navigate = useNavigate();

  if (!isAuthenticated && !isGuest) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              isDark={isDark}
              toggleTheme={toggleTheme}
              onAuth={(mode) => {
                setAuthMode(mode);
                navigate("/trips");
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {showTripModal && !isGuest && (
        <NewTripModal onClose={closeTripModal} onCreate={handleCreate} />
      )}
      {showProfile && !isGuest && (
        <ProfilePanel
          onClose={closeProfile}
          calendars={calendars}
          onAddCalendar={addCalendar}
          onRemoveCalendar={removeCalendar}
          onLogout={() => {
            logout();
            navigate("/login");
          }}
        />
      )}

      <Sidebar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={setActiveTripId}
        onNewTrip={() => !isGuest && openTripModal()}
        onOpenProfile={() => !isGuest && openProfile()}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isGuest={isGuest}
        onSignIn={() => {
          setAuthMode(null);
          navigate("/login");
        }}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <main className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-900">
        <StatusBar isGuest={isGuest} loading={loading} />

        <Routes>
          <Route
            path="/trips"
            element={
              <TripsPage
                trips={trips}
                onSelectTrip={(id) => {
                  setActiveTripId(id);
                  navigate("/calendar");
                }}
                onNewTrip={openTripModal}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <TripDetailPage
                trips={trips}
                activeTripId={activeTripId}
                onSelectTrip={setActiveTripId}
                onOpenProfile={() =>
                  isGuest ? setAuthMode(null) : openProfile()
                }
                calendarsSynced={calendarsSynced}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/friends"
            element={<FriendsPage trips={trips} isGuest={isGuest} />}
          />
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="*" element={<Navigate to="/trips" replace />} />
        </Routes>
      </main>
    </div>
  );
}
