"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useExpenseStore } from "@/store/useExpenseStore";
import RetouchExpenseForm from "@/components/trip/RetouchExpenseForm";

const mockMembers = [
  { user_id: 1, nickname: "최서현" },
  { user_id: 2, nickname: "김선태" },
  { user_id: 3, nickname: "이지은" },
];

export default function RetouchExpensePage({
  params,
}: {
  params: Promise<{ id: string }>; //URL → params → use(params) → id /url에서 id값 가져오기
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const expenseId = Number(searchParams.get("expenseId")); //searchParams.get("expenseId")는 문자열 "2"를 꺼내오고, Number()로 숫자 2로 변환

  const expense = useExpenseStore((s) =>
    s.expenses.find((e) => e.expense_id === expenseId),
  ); //expenseId랑 일치하는 영수증 한개가 들어옴.

  if (!expense) return <p className="p-4">영수증을 찾을 수 없습니다.</p>;

  return (
    <RetouchExpenseForm
      tripId={Number(id)}
      expense={expense}
      members={mockMembers}
    />
  );
}
