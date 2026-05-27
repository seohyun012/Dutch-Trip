import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ExpenseRequest, OcrResponse } from "@/types";

// OCR 분석 요청
async function uploadOcr(tripId: number, file: File): Promise<OcrResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post(`/trips/${tripId}/expenses/ocr`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// 지출 내역 등록
async function createExpense(tripId: number, body: ExpenseRequest) {
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