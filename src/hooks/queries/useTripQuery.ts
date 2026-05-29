import { useQuery } from "@tanstack/react-query"; //데이터 가져옴
import api from "@/lib/axios";
import type { MemberResponse, TripListItem } from "@/types";

// 참여자 목록 조회 API 호출 함수
async function fetchMembers(tripId: number): Promise<MemberResponse[]> {
  const { data } = await api.get(`/trips/${tripId}/members`);
  return data;
}

// 참여자 목록 조회 훅
export function useMembersQuery(tripId: number) {
  return useQuery({
    queryKey: ["members", tripId],
    queryFn: () => fetchMembers(tripId),
    refetchInterval: 5000, // 5초마다 자동으로 멤버 목록 다시 불러옴
  });
}

// 여행방 목록 조회 API 호출 함수 (명세서 2.2)
async function fetchTrips(): Promise<TripListItem[]> {
  const { data } = await api.get("/trips");
  return data; //얘는 배열로 바로 옴
}


// 여행방 목록 조회 훅
export function useTripsQuery() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });
}

async function fetchTrip(tripId: number): Promise<{ title: string }> {
  const { data } = await api.get(`/trips/${tripId}`);
  return data;
}

export function useTripQuery(tripId: number) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => fetchTrip(tripId),
  });
}