"use client";

import { useState } from "react";
import type { Expense } from "@/types"; //Expense 타입 가져오기
import MenuPanel from "./MenuPanel";

interface Props {
  // 이컴포넌트가 받아야하는 데이터 이름:타입 정의
  expense: Expense; // 영수증 한 장의 전체 데이터
  currentUserId: number; // 현재 로그인한 유저 ID (내 메뉴 하이라이트용)
  isFixed: boolean; // true = 고정금액 → 버튼 없음 / false = 추가금액 → 버튼 있음
  members: { user_id: number; nickname: string; role: string }[];
}

export default function ExpenseCard({
  expense,
  currentUserId,
  isFixed,
  members,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴선택 누르면 메뉴패널 열고닫기

  return (
    // relative: 내부 요소들의 absolute 기준점이 됨
    <div className="relative">
      {/*
        ── 티켓 모양 카드 본체 ──
        whitebox.png를 background-image로 사용.
        backgroundSize: "100% 100%" → 이미지가 div 크기에 맞게 늘어남 (좌우 노치도 함께 늘어남).
        backgroundColor: transparent → 흰 배경이 이미지 뒤에 깔리지 않도록 제거.
        padding은 노치(물결) 안쪽 여백을 주기 위해 인라인 style로 설정.
      */}
      <div
        style={{
          backgroundImage: "url('/whiteboxnew.png')",
          backgroundSize: "100% 100%", //이미지가 div 크기에 맞게 늘어남 (좌우 노치도 함께 늘어남)
          padding: "14px 28px",
        }}
      >
        {/* 제목 */}
        <p className="font-normal text-lg pb-4">{expense.title}</p>

        {/* 총 가격 */}
        <div className="font-normal text-xl text-black">
          <p>총 가격: {expense.total_amount.toLocaleString()}원</p>
          {/*천 단위마다 , 찍기*/}
          <p>결제자: {expense.payer.nickname}</p>
        </div>

        {/*
          ── 액션 버튼 영역 ──
          isFixed가 true(고정금액)이면 버튼 전체를 렌더링하지 않음.
          추가금액일 때만 영수증보기 / 글로쓰기 / 메뉴선택 버튼이 나옴.
        */}
        {!isFixed && (
          <div className="flex gap-1 mt-8">
            <button className="flex-1 text-lg bg-[#E5E5FE] py-1.5 text-black">
              영수증 보기
            </button>
            <button className="flex-1 text-lg bg-[#E5E5FE] py-1.5 text-black">
              글로 쓰기
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex-1 text-lg bg-[#E5E5FE] py-1.5 text-black"
            >
              메뉴 선택
            </button>
          </div>
        )}
      </div>

      {/*
        ── 메뉴 패널 (펼침 영역) ──
        조건 3가지가 모두 true일 때만 렌더링:
          1. isFixed가 false (추가금액 카드여야 함)
          2. menuOpen이 true (메뉴선택 버튼을 누른 상태)
          3. items 배열에 데이터가 있어야 함 (length > 0)
      */}
      {!isFixed && menuOpen && expense.items.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-[#E5E5FE] z-20">
          <MenuPanel
            items={expense.items}
            currentUserId={currentUserId}
            expenseId={expense.expense_id}
            members={members}
          />
        </div>
      )}
    </div>
  );
}
