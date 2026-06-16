import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedExpense {
  expense_id: number;
  total_amount: number;
  participant_user_ids: number[];
}

interface SettleStore { 
  selectedExpenses: SelectedExpense[];
  toggleExpenseParticipant: (expense_id: number, total_amount: number, user_id: number) => void;
}

export const useSettleStore = create<SettleStore>()(
  persist(
    (set) => ({
      selectedExpenses: [],
      toggleExpenseParticipant: (expense_id, total_amount, user_id) =>
        set((state) => {
          const existing = state.selectedExpenses.find(
            (e) => e.expense_id === expense_id
          );
          if (!existing) {
            return {
              selectedExpenses: [...state.selectedExpenses, { expense_id, total_amount, participant_user_ids: [user_id] }],
            };
          }
          const hasUser = existing.participant_user_ids.includes(user_id);
          return {
            selectedExpenses: state.selectedExpenses
              .map((e) =>
                e.expense_id === expense_id
                  ? { ...e, participant_user_ids: hasUser
                      ? e.participant_user_ids.filter((id) => id !== user_id)
                      : [...e.participant_user_ids, user_id] }
                  : e
              )
              .filter((e) => e.participant_user_ids.length > 0),
          };
        }),
    }),
    { name: "settle-store" }
  )
);