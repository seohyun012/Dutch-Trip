import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

async function fetchSettlements(tripId: number) {
  const { data } = await api.get(`/trips/${tripId}/settlements`);
  console.log("정산 응답:", data);
  return data.data;
}

export function useSettleQuery(tripId: number) {
  return useQuery({
    queryKey: ["settlements", tripId],
    queryFn: () => fetchSettlements(tripId),
  });
}