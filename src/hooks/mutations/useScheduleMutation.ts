import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ScheduleRequest } from "@/types";
import type { Schedule } from "@/store/useScheduleStore";

// 일정 추가 API 호출
// axios.ts에서 설정한 baseURL, Content-Type 자동 적용
async function addSchedule(tripId: number, body: ScheduleRequest): Promise<Schedule> {
  const { data } = await api.post(`/trips/${tripId}/schedules`, body);
  return data;
}

// 일정 추가 뮤테이션 훅
export function useAddScheduleMutation(tripId: number) {
  return useMutation({
    mutationFn: (body: ScheduleRequest) => addSchedule(tripId, body),
  });
}