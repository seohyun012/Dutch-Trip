"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plane, Receipt, ChevronLeft, Plus } from "lucide-react";
import ExpenseTab from "@/components/trip/ExpenseTab";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import ScheduleTab from "@/components/trip/ScheduleTab";
import { useMembersQuery, useTripsQuery } from "@/hooks/queries/useTripQuery";
import { useSchedulesQuery } from "@/hooks/queries/useScheduleQuery";
import Loading from "@/app/loading";

type Tab = "일정" | "영수증";

export default function TripPage({
  //대표함수
  params, //params: 1,2,3.... 이런것들(근데 문자열임)
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  //목데이터 제거 서버에서 가져옴
  const { data: members, isLoading: membersLoading } = useMembersQuery(
    Number(id),
  );
  const { data: trips, isLoading: tripsLoading } = useTripsQuery();
  const { data: schedules, isLoading: schedulesLoading } = useSchedulesQuery(
    Number(id),
  );

  // 여행 목록에서 현재 trip_id와 일치하는 여행을 찾아서 제목을 가져옴
  const currentTrip = trips?.find((t) => t.trip_id === Number(id));

  const router = useRouter(); //페이지이동
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    searchParams.get("tab") === "영수증" ? "영수증" : "일정",
  );

  // 로딩 조건에서 schedules 제거
  if (membersLoading || tripsLoading) return <Loading />;

  return (
    <main className="w-full min-h-screen bg-[#FFFFFF] flex flex-col">
      {/*w-full: width 100%, 
      min-h-screen: 화면 전체 높이(최소정하고 늘어남),
      bg-[#EBF4FF]: 배경색, 
      flex flex-col: 세로로 요소 배치*/}
      <Header title={currentTrip?.title ?? "여행"} backTo="/home" />
      {/* 탭 - 헤더에 딱 붙게, 좌우 여백 없음, 각진 모서리 */}
      <div className="flex w-full sticky top-14 z-20">
        <button
          onClick={() => setActiveTab("일정")}
          className={`flex-1 py-4 text-2xl font-bold flex items-center justify-center transition-colors ${
            //$: 조건에 따라 클래스 다르게줌.
            //flex-1: 버튼 두개 균등분할, transition-colors: 색이 부르럽게 바뀌도록
            activeTab === "일정"
              ? "bg-[#0000FA] text-white"
              : "bg-[#C3D1E6] text-gray-600"
          }`}
        >
          일정
          <Plane size={32} />
        </button>
        <button
          onClick={() => setActiveTab("영수증")}
          className={`flex-1 py-4 text-2xl font-bold flex items-center justify-center transition-colors ${
            activeTab === "영수증"
              ? "bg-[#0000FA] text-white"
              : "bg-[#C3D1E6] text-gray-600"
          }`}
        >
          영수증
          <Receipt size={32} />
        </button>
      </div>
      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/*부모가 flex이고 자식이 flex-1이면, 자식이 남은 공간을 다 차지함,
        overflow-y-auto: 세로로 넘칠 때 스크롤 생김. */}
        {activeTab === "영수증" && (
          //<ExpenseTab members={mockMembers} tripId={Number(id)} />
          <ExpenseTab members={members ?? []} tripId={Number(id)} />
        )}{" "}
        {/*참이면 뒤 실행*/}
        {activeTab === "일정" && (
          <ScheduleTab
            schedules={schedules ?? []}
            startDate={currentTrip?.start_date ?? ""}
            endDate={currentTrip?.end_date ?? ""}
          />
        )}
      </div>
      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 px-5 pb-4 bg-white flex flex-col gap-4 z-20">
        {activeTab === "영수증" && (
          <>
            <button
              onClick={() => router.push(`/trip/${id}/add-expense`)}
              className="w-full py-4 rounded-2xl bg-[#0C6DFF] text-white font-bold flex items-center justify-center active:scale-[0.98] transition-all"
            >
              <Plus size={32} strokeWidth={4} />
            </button>
            <Button
              label="정산 하기"
              onClick={() => router.push(`/trip/${id}/pay`)}
            />
          </>
        )}
        {activeTab === "일정" && (
          <button
            onClick={() => router.push(`/trip/${id}/add-schedule`)}
            className="w-full py-4 rounded-2xl bg-[#0C6DFF] text-white font-bold flex items-center justify-center active:scale-[0.98] transition-all"
          >
            <Plus size={32} strokeWidth={4} />
          </button>
        )}
      </div>
    </main>
  );
}
