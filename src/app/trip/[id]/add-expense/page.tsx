"use client";

import { useParams, useRouter } from "next/navigation";
import AddExpenseForm from "@/components/trip/AddExpenseForm";
import type { Expense, Participant } from "@/types";
import { useExpenseStore } from "@/store/useExpenseStore";

// 임시 멤버 데이터 (나중에 useTripQuery로 교체)
const mockMembers: Participant[] = [
  { user_id: 1, nickname: "최서현" },
  { user_id: 2, nickname: "김선태" },
  { user_id: 3, nickname: "이지은" },
];

export default function AddExpensePage() {
  const params = useParams();
  const tripId = Number(params.id);
  const { addExpense } = useExpenseStore();

  function handleSubmit(expense: Expense) {
    addExpense(expense); // store에 추가 → ExpenseTab에서 반영
  }

  return (
    <AddExpenseForm
      tripId={tripId}
      members={mockMembers}
      onSubmit={handleSubmit}
    />
  );
}
