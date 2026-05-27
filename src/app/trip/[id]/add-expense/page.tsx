"use client";

import { useParams } from "next/navigation";
import { useMembersQuery } from "@/hooks/queries/useTripQuery";
import AddExpenseForm from "@/components/trip/AddExpenseForm";

export default function AddExpensePage() {
  const params = useParams();
  const tripId = Number(params.id);
  const { data: members = [] } = useMembersQuery(tripId);

  return <AddExpenseForm tripId={tripId} members={members} />;
}
