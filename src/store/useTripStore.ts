import { create } from "zustand";

interface Cost {
  id: number;
  item: string;
  price: string;
}

interface TripState {
  tripName: string;
  startDate: string;
  endDate: string;
  costs: Cost[];
  setTripData: (data: Partial<TripState>) => void;
}

export const useTripStore = create<TripState>((set) => ({
  tripName: "",
  startDate: "",
  endDate: "",
  costs: [],
  setTripData: (data) => set((state) => ({ ...state, ...data })),
}));