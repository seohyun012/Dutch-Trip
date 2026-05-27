"use client";

import { useParams } from "next/navigation";
import AddScheduleForm from "@/components/trip/AddScheduleForm";
import type { ScheduleRequest } from "@/types";
import { useAddScheduleMutation } from "@/hooks/mutations/useScheduleMutation";

// 여행 기간 날짜 목록 (나중에 useTripQuery로 교체)
// trip/[id]/page.tsx의 mockMembers처럼, 실제 연동 시 둘 다 같이 교체
const MOCK_TRIP_DATES = ["2026-05-01", "2026-05-02", "2026-05-03"];

export default function AddSchedulePage() {
  const params = useParams();
  const tripId = Number(params.id);
  const { mutateAsync } = useAddScheduleMutation(tripId);

  async function handleSubmit(schedule: ScheduleRequest) {
    await mutateAsync(schedule); 
  }

  return (
    <AddScheduleForm
      tripId={tripId}
      tripDates={MOCK_TRIP_DATES}
      onSubmit={handleSubmit}
    />
  );
}
