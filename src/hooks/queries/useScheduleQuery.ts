import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Schedule } from "@/store/useScheduleStore";

// 일정 목록 조회 API 호출 함수 (명세서 3.2)
// 서버가 시간순으로 자동 정렬해서 돌려줌
async function fetchSchedules(tripId: number): Promise<Schedule[]> {
  const { data } = await api.get(`/trips/${tripId}/schedules`);
  return data;
}

// 일정 목록 조회 훅
// 사용하는 곳에서: const { data: schedules } = useSchedulesQuery(tripId);
export function useSchedulesQuery(tripId: number) {
  return useQuery({
    queryKey: ["schedules", tripId],  // tripId별로 캐시 분리
    queryFn: () => fetchSchedules(tripId),
  });
}