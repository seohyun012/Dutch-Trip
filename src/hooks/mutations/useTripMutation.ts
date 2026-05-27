import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { TripRequest, TripResponse, JoinTripRequest } from "@/types";

// 여행방 생성 API 호출 함수 (API 명세서 2.1)
async function createTrip(body: TripRequest): Promise<TripResponse> {
  const { data } = await api.post("/trips", body);
  return data;
}

// 여행방 생성 뮤테이션 훅
// 사용하는 곳에서: const { mutateAsync } = useCreateTripMutation();
export function useCreateTripMutation() {
  return useMutation({
    mutationFn: (body: TripRequest) => createTrip(body),
  });
}

// 초대 코드로 여행 참여 API 호출 함수 (API 명세서 2.4)
async function joinTrip(body: JoinTripRequest): Promise<TripResponse> {
  const { data } = await api.post("/trips/join", body);
  return data;
}

// 초대 코드로 여행 참여 뮤테이션 훅
export function useJoinTripMutation() {
  return useMutation({
    mutationFn: (body: JoinTripRequest) => joinTrip(body),
  });
}