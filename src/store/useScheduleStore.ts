import { create } from "zustand";
import type { ScheduleResponse } from "@/types";

export interface Schedule {
  schedule_id: number;
  schedule_date: string;        // "2026-05-01"
  schedule_time: string;        // "2026-05-01T12:00:00"
  title: string;
  content: string;
}

// 더미 데이터 (영수증 store와 동일한 방식)
const mockSchedules: Schedule[] = [
  {
    schedule_id: 1,
    schedule_date: "2026-05-01",
    schedule_time: "2026-05-01T09:00:00",
    title: "가평역 집합",
    content: "오전 9시 가평역 1번 출구 앞에서 만나기",
  },
  {
    schedule_id: 2,
    schedule_date: "2026-05-01",
    schedule_time: "2026-05-01T12:00:00",
    title: "닭갈비 점심",
    content: "가평역 근처 유명 닭갈비 맛집에서 점심 식사",
  },
  {
    schedule_id: 3,
    schedule_date: "2026-05-01",
    schedule_time: "2026-05-01T15:00:00",
    title: "자라섬 산책",
    content: "자라섬 공원 한 바퀴 돌고 카페 들르기",
  },
  {
    schedule_id: 4,
    schedule_date: "2026-05-02",
    schedule_time: "2026-05-02T10:00:00",
    title: "래프팅",
    content: "북한강 래프팅 2시간 코스, 장비 대여 포함",
  },
  {
    schedule_id: 5,
    schedule_date: "2026-05-02",
    schedule_time: "2026-05-02T18:00:00",
    title: "바베큐",
    content: "숙소 앞마당에서 저녁 바베큐 파티",
  },
];

interface ScheduleStore {
  schedules: ScheduleResponse[]; //차피 store 사용 안 하지만 혹시 몰라서 
  addSchedule: (schedule: ScheduleResponse) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: mockSchedules,
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),
}));