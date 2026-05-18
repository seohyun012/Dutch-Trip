"use client";

import AddTripForm from "@/components/trip/AddTripForm";
import type { Trip } from "@/store/useTripStore";
import { useTripStore } from "@/store/useTripStore";

export default function AddTripPage() {
  const { addTrip } = useTripStore();

  function handleSubmit(trip: Trip) {
    //폼에서 데이터 만들어서 제출누르면 여기함수 실행, 여행데이터 넘어와서 여행추가 함수 실행
    addTrip(trip);
  }

  return <AddTripForm onSubmit={handleSubmit} />; //AddTripForm한테 "제출 버튼 누르면 handleSubmit 실행해줘" 라고 넘겨주는 거
}
