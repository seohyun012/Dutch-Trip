import { create } from "zustand";
import { persist } from "zustand/middleware"; // 새로고침 방지용

interface Schedule {
  id: number;
  day: number;
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
  schedules: Schedule[];
  setTripData: (data: Partial<TripState>) => void;
  addSchedule: (newSchedule: Schedule) => void;
  deleteSchedule: (id: number) => void; // ★ 추가: 일정 삭제 함수 타입 정의
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
        
      deleteSchedule: (id) => // ★ 추가: 선택한 id를 제외한 나머지 일정만 남기도록 필터링
        set((state) => ({
          schedules: state.schedules.filter((schedule) => schedule.id !== id),
        })),
    }),
    { name: "trip-storage" } // 로컬 스토리지 저장 키 이름
  )
);