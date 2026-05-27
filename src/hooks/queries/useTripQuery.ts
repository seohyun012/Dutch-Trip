import { useQuery } from "@tanstack/react-query"; //데이터 가져옴
import api from "@/lib/axios";
import type { MemberResponse } from "@/types";

// 참여자 목록 조회 API 호출 함수
async function fetchMembers(tripId: number): Promise<MemberResponse[]> {
  const { data } = await api.get(`/trips/${tripId}/members`);
  return data.data; //백엔드에서 응답을 데이터 안에 데이터로 보내서 data -> data.data
}

// 참여자 목록 조회 훅
// 사용하는 곳에서 const { data: members, isLoading } = useMembersQuery(tripId);
export function useMembersQuery(tripId: number) {
  return useQuery({
    queryKey: ["members", tripId],   // 캐시 키: tripId별로 따로 저장 
    queryFn: () => fetchMembers(tripId),
  });
}

async function fetchTrip(tripId: number): Promise<{ title: string }> {
  const { data } = await api.get(`/trips/${tripId}`);
  return data.data;
}

export function useTripQuery(tripId: number) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => fetchTrip(tripId),
  });
}