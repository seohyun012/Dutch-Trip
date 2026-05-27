"use client";

import { useParams } from "next/navigation";
import AddScheduleForm from "@/components/trip/AddScheduleForm";
import type { ScheduleRequest } from "@/types";
import { useAddScheduleMutation } from "@/hooks/mutations/useScheduleMutation";
import { useTripsQuery } from "@/hooks/queries/useTripQuery";
import { getDateRange } from "@/lib/utils";
import Loading from "@/app/loading";

/*여행 기간 날짜 목록 (나중에 useTripQuery로 교체)
trip/[id]/page.tsx의 mockMembers처럼, 실제 연동 시 둘 다 같이 교체
const MOCK_TRIP_DATES = ["2026-05-01", "2026-05-02", "2026-05-03"];*/

export default function AddSchedulePage() {
  const params = useParams();
  const tripId = Number(params.id);
  const { mutateAsync } = useAddScheduleMutation(tripId);

  // 여행방 목록 조회 후, 현재 tripId인 여행방 찾기
  // 그 여행방의 start_date ~ end_date 사이 날짜들을 배열로 만듦
  const { data: trips, isLoading } = useTripsQuery();
  const currentTrip = trips?.find((t) => t.trip_id === tripId);
  const tripDates = currentTrip
    ? getDateRange(currentTrip.start_date, currentTrip.end_date)
    : [];

  async function handleSubmit(schedule: ScheduleRequest) {
    await mutateAsync(schedule); 
  }

  if (isLoading) return <Loading />; //여행방 목록 로딩중일 때 뜸

  return (
    <AddScheduleForm
      tripId={tripId}
      tripDates={tripDates}
      onSubmit={handleSubmit}
    />
  );
}