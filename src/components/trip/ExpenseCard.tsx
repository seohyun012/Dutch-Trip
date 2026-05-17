"use client";

import { useState } from "react";
import type { Expense } from "@/types"; //Expense 타입 가져오기
import MenuPanel from "./MenuPanel";
import { useSettleStore } from "@/store/useSettleStore";
import type { Participant } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  // 이컴포넌트가 받아야하는 데이터 이름:타입 정의
  expense: Expense; // 영수증 한 장의 전체 데이터
  currentUserId: number; // 현재 로그인한 유저 ID (내 메뉴 하이라이트용)
  members: Participant[];
  tripId: number;
}

export default function ExpenseCard({
  expense,
  currentUserId,
  members,
  tripId,
}: Props) {
  const router = useRouter();
  const isFixed = expense.expense_type === "고정금액";
  const isPersonal = expense.split_type === "개인";
  const isDutch = expense.split_type === "더치";
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴선택 누르면 메뉴패널 열고닫기
  const { selectedExpenses, toggleExpenseParticipant } = useSettleStore();
  //selectedExpenses: 내가 선택한 영수증들을 담음. toggleExpenseParticipant: 영수증 선택/해제하는 함수
  const isSelected = selectedExpenses.some(
    //지금이게 선택 바구니에 있는지 확인.
    (e) => e.expense_id === expense.expense_id,
  );

  return (
    // relative: 내부 요소들의 absolute 기준점이 됨
    <div className="relative">
      {/*
        ── 티켓 모양 카드 본체 ──
        whitebox.png를 background-image로 사용.
        backgroundSize: "100% 100%" → 이미지가 div 크기에 맞게 늘어남 (좌우 노치도 함께 늘어남).
        padding은 노치(물결) 안쪽 여백을 주기 위해 인라인 style로 설정.
      */}
      <div
        onClick={() => {
          if (!isFixed)
            toggleExpenseParticipant(
              expense.expense_id,
              expense.total_amount,
              currentUserId,
            );
        }}
        className={isFixed ? "" : "cursor-pointer"}
        style={{
          backgroundImage: isSelected
            ? "url('/blueboxnew.png')"
            : "url('/whiteboxnew.png')",
          backgroundSize: "100% 100%",
          padding: "14px 28px",
        }}
      >
        {/* 제목 */}
        <div className="flex items-center justify-between pb-4">
          <p className="font-normal text-lg">{expense.title}</p>
          {expense.split_type && (
            <p className="font-normal text-lg text-[#0C6DFF]">
              {expense.split_type === "개인" ? "개인메뉴" : "더치페이"}
            </p>
          )}
        </div>

        {/* 총 가격 */}
        <div className="font-normal text-xl text-black">
          <p>총 가격: {expense.total_amount.toLocaleString()}원</p>
          {/*천 단위마다 , 찍기*/}
          <p>결제자: {expense.payer.nickname}</p>
          {!isFixed && (
            <p>
              참여자:{" "}
              {selectedExpenses //useSettleStore의 selectedExpenses에서 가져온 id를 여기서 nickname으로 반환
                .find((e) => e.expense_id === expense.expense_id) //선택한 영수증 바구니
                ?.participant_user_ids.map(
                  (id) => members.find((m) => m.user_id === id)?.nickname,
                )
                .filter(Boolean)
                .join(", ") || "없음"}
            </p>
          )}
        </div>

        {/*
          ── 액션 버튼 영역 ──
          isFixed가 true(고정금액)이면 버튼 전체를 렌더링하지 않음.
          추가금액일 때만 영수증보기 / 글로쓰기 / 메뉴선택 버튼이 나옴.
        */}
        {!isFixed && (
          <div className="flex gap-1 mt-8 mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (expense.receipt_image_url)
                  window.open(expense.receipt_image_url, "_blank");
              }}
              className="flex-1 text-lg bg-[#E5E5FE] py-1 text-black"
            >
              영수증 보기
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `/trip/${tripId}/retouch-expense?expenseId=${expense.expense_id}`,
                );
              }}
              className="flex-1 text-lg bg-[#E5E5FE] py-1 text-black"
            >
              글로 쓰기
            </button>
            {isPersonal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex-1 text-lg bg-[#E5E5FE] py-1 text-black"
              >
                메뉴 선택
              </button>
            )}
            {isDutch && expense.item_count > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex-1 text-lg bg-[#E5E5FE] py-1 text-black"
              >
                메뉴 보기
              </button>
            )}
          </div>
        )}
      </div>

      {/*
        ── 메뉴 패널 (펼침 영역) ──
        조건 3가지가 모두 true일 때만 렌더링:
          1. 개인금액이거나 메뉴가 있는 더치
          2. menuOpen이 true (메뉴선택 버튼을 누른 상태)
          3. items 배열에 데이터가 있어야 함 (count > 0)
      */}
      {menuOpen && (isPersonal || (isDutch && expense.item_count > 0)) && (
        <div className="absolute top-full left-0 w-full bg-[#E5E5FE] z-20">
          <MenuPanel
            items={expense.items}
            currentUserId={currentUserId}
            expenseId={expense.expense_id}
            members={members}
            readOnly={isDutch}
          />
        </div>
      )}
    </div>
  );
}
