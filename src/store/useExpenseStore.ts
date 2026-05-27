import { create } from "zustand";
import type { Expense } from "@/types";


interface ExpenseStore { //store안에 아래 두개 가 꼭 필요하다고 전해줌.
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void; // 서버 데이터를 넣는 함수 추가
  addExpense: (expense: Expense) => void;
  updateExpense: (updated: Expense) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (updated) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.expense_id === updated.expense_id ? updated : e,
      ),
    })),
}));