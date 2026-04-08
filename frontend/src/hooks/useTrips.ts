import { useState, useEffect } from "react";
import type { Trip, CreateTripData } from "../types";
import { getTripsApi, createTripApi, deleteTripApi } from "../api/trip";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      setLoading(true);
      const data = await getTripsApi();
      setTrips(data.map(normalizeTrip));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTrip(data: CreateTripData): Promise<Trip> {
    const trip = await createTripApi(data);
    const normalized = normalizeTrip(trip);
    setTrips((prev) => [...prev, normalized]);
    return normalized;
  }

  async function deleteTrip(tripId: string) {
    await deleteTripApi(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  }
  return { trips, loading, error, createTrip, deleteTrip, refetch: fetchTrips };
}

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
