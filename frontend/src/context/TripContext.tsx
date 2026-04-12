import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Trip, CreateTripData } from "../types";
import { getTripsApi, createTripApi, deleteTripApi } from "../api/trip";
import { useAuth } from "./AuthContext";

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  activeTripId: string | null;
  showTripModal: boolean;
  setActiveTripId: (id: string | null) => void;
  openTripModal: () => void;
  closeTripModal: () => void;
  handleCreate: (data: CreateTripData) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const TripContext = createContext<TripContextType | null>(null);

function normalizeTrip(raw: any): Trip {
  const start = new Date(raw.startDate);
  return {
    ...raw,
    year: start.getFullYear(),
    month: start.getMonth(),
    dest: raw.destination,
    memberIds: (raw.members ?? []).map((_: any, i: number) => i + 1),
    isOwner: raw.isOwner === true,
    acceptedCount: raw.acceptedCount ?? 0,
    declinedCount: raw.declinedCount ?? 0,
    currentUserStatus: raw.currentUserStatus ?? "PENDING",
  };
}

export function TripProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
      setActiveTripId(null);
    }
  }, [isAuthenticated]);

  async function fetchTrips() {
    try {
      setLoading(true);
      setError(null);
      const data = await getTripsApi();
      setTrips(data.map(normalizeTrip));
    } catch (err: any) {
      setError(err.message || "Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: CreateTripData) {
    const newTrip = await createTripApi(data);
    const normalized = normalizeTrip(newTrip);
    setTrips((prev) => [...prev, normalized]);
    setActiveTripId(normalized.id);
    setShowTripModal(false);
  }

  async function deleteTrip(tripId: string) {
    await deleteTripApi(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId) setActiveTripId(null);
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        error,
        activeTripId,
        showTripModal,
        setActiveTripId,
        openTripModal: () => setShowTripModal(true),
        closeTripModal: () => setShowTripModal(false),
        handleCreate,
        deleteTrip,
        refetch: fetchTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrips must be used within TripProvider");
  return ctx;
}
