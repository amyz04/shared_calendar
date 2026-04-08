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
  setActiveTripId: (id: string | null) => void;
  createTrip: (data: CreateTripData) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const TripContext = createContext<TripContextType | null>(null);

function normalizeTrip(trip: Trip): Trip {
  const start = new Date(trip.startDate);
  return {
    ...trip,
    year: start.getFullYear(),
    month: start.getMonth(),
    dest: trip.destination,
    memberIds: trip.members.map((_, i) => i + 1),
  };
}

export function TripProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

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

  async function createTrip(data: CreateTripData): Promise<Trip> {
    const newTrip = await createTripApi(data);
    const normalized = normalizeTrip(newTrip);
    setTrips((prev) => [...prev, normalized]);
    setActiveTripId(normalized.id);
    return normalized;
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
        setActiveTripId,
        createTrip,
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
