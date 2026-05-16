"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Receipt, ChevronLeft, Plus } from "lucide-react";
import ExpenseTab from "@/components/trip/ExpenseTab";

type Tab = "일정" | "영수증";

export default function TripPage({
  //대표함수
  params, //params: 1,2,3.... 이런것들(근데 문자열임)
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter(); //페이지이동
  const [activeTab, setActiveTab] = useState<Tab>("영수증"); //탭선택 함수, 처음에는 영수증

  return (
    <main className="w-full min-h-screen bg-[#FFFFFF] flex flex-col">
      {/*w-full: width 100%, 
      min-h-screen: 화면 전체 높이(최소정하고 늘어남),
      bg-[#EBF4FF]: 배경색, 
      flex flex-col: 세로로 요소 배치*/}
      <header className="relative flex items-center py-3 bg-[#0C6DFF] sticky top-0 z-20">
        {/*  flex: 한줄로보이게(가로정렬), 
        items-center: 그 한줄안에서 위아래 높이 맞춤,
        px-3: 좌우 패딩, py-3: 상하 패딩 
        sticky: 스크롤해도 해더고정,
        top-0: 최상단 고정,*/}
        <button
          onClick={() => router.back()} //클릭하면 뒤로가기
          className="absolute left-3 text-white"
        >
          <ChevronLeft size={34} strokeWidth={3} />
        </button>
        <h1 className="w-full text-center font-bold text-2xl text-white">
          {/*2xl: 24px 숫자쓰면 안되고 이 규칙 지켜야함. */}
          가평 여행
        </h1>
      </header>
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
        {activeTab === "영수증" && <ExpenseTab />} {/*참이면 뒤 실행*/}
        {activeTab === "일정" && (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            일정 탭 준비 중
          </div>
        )}
      </div>
      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 px-5 pb-4 bg-white flex flex-col gap-4 z-20">
        <button
          onClick={() => router.push(`/trip/${id}/add-expense`)}
          className="w-full py-4 rounded-2xl bg-[#0C6DFF] text-white font-bold flex items-center justify-center"
        >
          <Plus size={34} strokeWidth={4} />
        </button>
        <button className="w-full py-4 rounded-2xl bg-[#0C6DFF] text-white font-bold text-2xl">
          {/*글자 버튼은 자동으로 가운데정렬됨*/}
          정산 하기
        </button>
      </div>
    </main>
  );
}
