"use client";

import { useState } from "react"; // useState: 세트만들어주는 함수
import { ChevronDown } from "lucide-react";
import type { Expense } from "@/types"; // @/ : /src
import ExpenseCard from "./ExpenseCard";
import { useExpenseStore } from "@/store/useExpenseStore";

// 현재 로그인 유저 ID - 실제 서비스에서는 Zustand store(useAuthStore)에서 가져옴
const CURRENT_USER_ID = 1;

interface Props {
  members: { user_id: number; nickname: string }[];
  tripId: number;
}

function formatTimeParts(iso: string) {
  //formatTimeParts: ISO 날짜 문자열에서 시(hh)와 분(mm)을 분리해서 반환.
  //string타입 매개변수이름:iso
  const d = new Date(iso); //Date 상수 객체 선언, 이걸 해야 꺼내올 수 있음.
  return {
    hh: String(d.getHours()).padStart(2, "0"), //padStart(2, "0") → 한 자리 숫자 앞에 0 붙임 (9 → "09")
    mm: String(d.getMinutes()).padStart(2, "0"),
  };
}

function groupByDay(expenses: Expense[]) {
  //expenses이름으로 Expense타입 배열 매개변수 받기
  //추가금액지출목록 날짜별로 묶기
  //영수증 하나씩 꺼내서 e라고 부름
  const dates = [
    ...new Set(
      expenses
        .filter((e) => e.payment_time) //payment_time이 있는 것만 필터링
        .map((e) => e.payment_time!.slice(0, 10)), // !붙인이유: 무조건 있다고 확신해라
    ), //slice:날짜만 잘라오기, set:중복제거
  ].sort();
  return dates.map((date, i) => ({
    //map: 배열의 값(date:내가 지은 이름)을 꺼내오면서 인덱스(i) 자동으로 붙여줌. 그리고 새 배열 만들어줌.
    label: `DAY ${i + 1}`, //DAY 1, DAY 2... 형식으로 라벨 생성
    items: expenses.filter((e) => e.payment_time?.startsWith(date)), //?붙인이유: 있으면 해라
    //expenses 전체에서 payment_time이 date로 시작하는 것만 골라냄
  })); //같은 date애들을 묶어서 이름붙이고 같이 정렬된 배열반환
}

export default function ExpenseTab({ members, tripId }: Props) {
  // 메인함수
  const { expenses: mockExpenses } = useExpenseStore();
  const fixed = mockExpenses.filter((e) => e.expense_type === "고정금액"); // expense_type 기준으로 고정금액 / 추가금액 분리
  const additional = mockExpenses.filter((e) => e.expense_type === "추가금액");
  //additional, mockExpenses: expense타입 배열

  const dayGroups = groupByDay(additional); // 추가금액을 날짜별 DAY 그룹으로 변환

  const [activeDayIdx, setActiveDayIdx] = useState(0); //activeDayIdx: 현재 선택된 DAY 인덱스
  const [dropdownOpen, setDropdownOpen] = useState(false); //DAY 선택 드롭다운 열고 닫는거, 처음엔 닫힘

  const activeGroup = dayGroups[activeDayIdx]; //현재선택된 day의 그룹 ex.DAY1

  return (
    <div className="pb-6 px-4">
      {/*pb-6: 하단고정버튼위로 24px*/}
      <div className="flex items-center gap-2 pt-3 pb-3">
        <span className="text-2xl font-normal text-black whitespace-nowrap">
          {/*whitespace-nowrap: 줄바꿈금지, span: 텍스트 크기만큼 차지*/}
          고정금액
        </span>
        <div className="flex-1 h-[3px] bg-black" />
        {/*flex-1: 남은 공간 다 차지*/}
      </div>

      {/*고정금액카트목록*/}
      <div className="flex flex-col gap-4">
        {fixed.map((e) => (
          <ExpenseCard // ExpenseCard로 데이터 넘기기
            key={e.expense_id} // React가 리스트 항목을 구분하는 고유 키
            expense={e}
            currentUserId={CURRENT_USER_ID}
            members={members}
            tripId={tripId}
          />
        ))}
      </div>

      {/*추가금액 섹션 헤더*/}
      <div className="mt-15 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-normal text-black whitespace-nowrap">
            추가금액
          </span>
          <div className="flex-1 h-[3px] bg-black" />
        </div>

        {/*
          ── DAY 드롭다운 ──
          inline-block: 버튼 너비가 내용에 맞게 줄어듦 (full-width 방지).
          버튼 클릭 시 dropdownOpen 토글.
          드롭다운 메뉴는 absolute로 버튼 바로 아래 위치.
        */}
        <div className="relative inline-block">
          <button
            onClick={() => setDropdownOpen((v) => !v)} // v:현재값 -> !v:반전된값
            className="flex items-center text-2xl font-normal text-black"
          >
            {/* activeGroup이 없을 경우 기본값 "DAY 1" 표시 */}
            {activeGroup?.label ?? "DAY 1"}
            <ChevronDown size={30} strokeWidth={3} />
          </button>

          {/* dropdownOpen이 true일 때만 메뉴 렌더링 */}
          {dropdownOpen && (
            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded shadow-md z-30">
              {dayGroups.map((g, i) => (
                //day한개씩 꺼낼때 g라고 이름붙임. i는 자동인덱스
                <button
                  key={g.label}
                  onClick={() => {
                    setActiveDayIdx(i); // 선택한 DAY로 전환
                    setDropdownOpen(false); // 드롭다운 닫기
                  }}
                  className={`block w-full text-center px-5 py-2 text-lg ${
                    i === activeDayIdx
                      ? "text-blue-500 font-bold" // 현재 선택된 DAY 강조
                      : "text-gray-700"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*
        ── 타임라인 ──
        activeGroup이 있을 때만 렌더링 (데이터 없으면 표시 안 함).
        relative: 세로선(absolute)의 기준점.
      */}
      {activeGroup && (
        <div className="relative">
          <div
            className="absolute top-2 bottom-0" //세로선
            style={{
              width: "40px",
              borderRadius: "11px",
              background:
                "linear-gradient(to bottom, #0C6DFF 0%, #87B7FF 66%, #FFFFFF 100%)",
            }}
          />

          {activeGroup.items.map((e) => {
            const { hh, mm } = formatTimeParts(e.payment_time!);
            return (
              <div key={e.expense_id} className="flex items-center">
                <div className="w-10 flex-shrink-0 flex flex-col items-center text-2xl font-normal text-black z-10 leading-tight">
                  {/*w-10: 시간 위치 고정,
                  flex-shrink-0: 시간영역 너비 유지,
                  leading-tight: 시/분 간격 좁게*/}
                  <span>{hh}</span>
                  <span>{mm}</span>
                </div>

                {/* 카드 */}
                <div className="flex-1 min-w-0 ml-4">
                  {/*원래는 내용물만큼이 최소너비로 잡히는데 min-w-0:최소너비를 0으로 함으로써, 내용이 길어도 세로로 길어들수 있게함.*/}
                  <ExpenseCard
                    key={e.expense_id}
                    expense={e}
                    currentUserId={CURRENT_USER_ID}
                    members={members}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
