import { create } from "zustand";
import { persist } from "zustand/middleware"; // 새로고침 방지용

interface Schedule { //추가
  id: number;
  title: string;
  time: string;
  content: string;
}

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
  schedules: Schedule[]; // 추가: 일정들을 담을 배열
  setTripData: (data: Partial<TripState>) => void;
  addSchedule: (newSchedule: Schedule) => void; // 추가: 일정 추가 함수
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      tripName: "",
      startDate: "",
      endDate: "",
      costs: [],
      schedules: [], // 초기값 빈 배열
      setTripData: (data) => set((state) => ({ ...state, ...data })),
      addSchedule: (newSchedule) =>
        set((state) => ({
          schedules: [...state.schedules, newSchedule], // 기존 일정 뒤에 새 일정 붙이기
        })),
    }),
    { name: "trip-storage" } // 로컬 스토리지 저장 키 이름
  )
);