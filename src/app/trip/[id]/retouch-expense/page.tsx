"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useMembersQuery } from "@/hooks/queries/useTripQuery";
import RetouchExpenseForm from "@/components/trip/RetouchExpenseForm";

export default function RetouchExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tripId = Number(id);
  const searchParams = useSearchParams();
  const expenseId = Number(searchParams.get("expenseId"));

  const expense = useExpenseStore((s) =>
    s.expenses.find((e) => e.expense_id === expenseId),
  );
  const { data: members = [] } = useMembersQuery(tripId);

  if (!expense) return <p className="p-4">영수증을 찾을 수 없습니다.</p>;

  return (
    <RetouchExpenseForm tripId={tripId} expense={expense} members={members} />
  );
}
