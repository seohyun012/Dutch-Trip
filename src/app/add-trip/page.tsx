"use client";

import AddTripForm from "@/components/trip/AddTripForm";
import type { TripRequest } from "@/types";
import { useCreateTripMutation } from "@/hooks/mutations/useTripMutation";

export default function AddTripPage() {
  const { mutateAsync } = useCreateTripMutation();

  async function handleSubmit(trip: TripRequest) {
    //폼에서 데이터 만들어서 제출누르면 여기함수 실행, 여행데이터 넘어와서 여행추가 함수 실행
    //addTrip(trip);
    const response = await mutateAsync(trip);
    return response; // AddTripForm에서 trip_id, invite_code를 사용하기 위해 반환
  }

  return <AddTripForm onSubmit={handleSubmit} />; //AddTripForm한테 "제출 버튼 누르면 handleSubmit 실행해줘" 라고 넘겨주는 거
}
