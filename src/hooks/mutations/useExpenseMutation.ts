import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ExpenseRequest, OcrResponse } from "@/types";

// OCR 분석 요청
async function uploadOcr(tripId: number, file: File): Promise<OcrResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post(`/trips/${tripId}/expenses/ocr`, formData);
  console.log("OCR 응답 상세:", JSON.stringify(data.data));
  return data.data;
}

// 지출 내역 등록
async function createExpense(tripId: number, body: ExpenseRequest) {
  console.log("영수증 등록 데이터:", body);
  const { data } = await api.post(`/trips/${tripId}/expenses`, body);
  return data.data;
}

export function useOcrMutation(tripId: number) {
  return useMutation({
    mutationFn: (file: File) => uploadOcr(tripId, file),
  });
}

export function useCreateExpenseMutation(tripId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ExpenseRequest) => createExpense(tripId, body),
    onSuccess: () => {
      // 등록 성공 후 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}

async function updateExpense(tripId: number, expenseId: number, body: ExpenseRequest) {
  const { data } = await api.put(`/trips/${tripId}/expenses/${expenseId}`, body);
  return data.data;
}

export function useUpdateExpenseMutation(tripId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, body }: { expenseId: number; body: ExpenseRequest }) =>
      updateExpense(tripId, expenseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
    },
  });
}

