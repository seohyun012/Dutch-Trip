"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Expense } from "@/types";

async function fetchExpenses(tripId: number): Promise<Expense[]> {
  const { data } = await api.get(`/trips/${tripId}/expenses`);
  return data.data;
}

export function useExpenseQuery(tripId: number) {
  return useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => fetchExpenses(tripId),
  });
}