import { create } from "zustand";
import type { Expense } from "@/types";

// ExpenseTab의 더미데이터 초기값
const initialExpenses: Expense[] = [
  {
    expense_id: 1,
    title: "호텔",
    total_amount: 50000,
    expense_type: "고정금액",
    payer: { user_id: 1, nickname: "최서현" },
    item_count: 0,
    items: [],
  },
  {
    expense_id: 10,
    title: "저녁밥",
    total_amount: 120000,
    expense_type: "고정금액",
    payer: { user_id: 1, nickname: "최서현" },
    item_count: 0,
    items: [],
  },
  {
    expense_id: 2,
    title: "대성리 피자",
    total_amount: 45000,
    expense_type: "추가금액",
    split_type: "개인",
    payment_time: "2026-05-01T12:00:00",
    receipt_image_url: "https://example.com/receipt1.jpg",
    payer: { user_id: 1, nickname: "최서현" },
    item_count: 4,
    items: [
      { item_name: "알리올리오 파스타", price: 10000, participants: [] },
      { item_name: "투움바 파스타", price: 15000, participants: [] },
      { item_name: "마르게리따 피자", price: 18000, participants: [] },
      { item_name: "콜라 500ml", price: 2000, participants: [] },
    ],
  },
  {
    expense_id: 3,
    title: "영수증1",
    total_amount: 10000,
    expense_type: "추가금액",
    split_type: "더치",
    payment_time: "2026-05-01T16:00:00",
    receipt_image_url: "https://example.com/receipt2.jpg",
    payer: { user_id: 2, nickname: "김선태" },
    item_count: 3,
    items: [
      { item_name: "파스타", price: 10000, participants: [] },
      { item_name: "피자", price: 15000, participants: [] },
      { item_name: "똥", price: 18000, participants: [] },
    ],
  },
  {
    expense_id: 4,
    title: "영수증2",
    total_amount: 10000,
    expense_type: "추가금액",
    split_type: "더치",
    payment_time: "2026-05-02T21:45:00",
    payer: { user_id: 2, nickname: "김선태" },
    item_count: 0,
    items: [],
  },
];

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: initialExpenses,
  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
    })),
}));