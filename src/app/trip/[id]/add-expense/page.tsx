"use client";

import { useParams, useRouter } from "next/navigation";
import AddExpenseForm from "@/components/trip/AddExpenseForm";
import type { Expense, Participant } from "@/types";
import { useExpenseStore } from "@/store/useExpenseStore";

// 임시 멤버 데이터 (나중에 useTripQuery로 교체) 이거랑 trip/[id]/page.tsx에 똑같은거 있는데 둘다 변경해야함
const mockMembers: Participant[] = [
  { user_id: 1, nickname: "최서현" },
  { user_id: 2, nickname: "김선태" },
  { user_id: 3, nickname: "이지은" },
];

export default function AddExpensePage() {
  const params = useParams(); //[id]가 동적이라서 접속한 페이지 아이디를 주는거임.
  const tripId = Number(params.id); //그 아이디를 tripId가 받음
  const { addExpense } = useExpenseStore(); //store에서 addExpense 함수만 꺼내는 거

  function handleSubmit(expense: Expense) {
    //newExpense가 매개변수로 들어옴
    //이대로 반영하기
    addExpense(expense); // store에 추가 → ExpenseTab에서 반영
  } //newExpense를 새영수증에 추가

  return (
    <AddExpenseForm
      tripId={tripId}
      members={mockMembers}
      onSubmit={handleSubmit}
    />
  );
}
