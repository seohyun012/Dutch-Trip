import { create } from "zustand";

export interface FixedExpense {
  item_name: string;
  price: number;
}

export interface Trip {
  trip_id: number;
  title: string;
  invite_code: string;
  start_date: string;   // "2026-05-01"
  end_date: string;     // "2026-05-03"
  fixed_expenses: FixedExpense[];
}

const mockTrips: Trip[] = [];

interface TripStore { //store안에 들어있는것들
  trips: Trip[];
  addTrip: (trip: Trip) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: mockTrips,
  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
}));