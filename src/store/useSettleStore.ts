import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedItem {
  expense_id: number;
  item_name: string;
  price: number;
  participant_user_ids: number[];
}

interface SettleStore {
  selectedItems: SelectedItem[];
  toggleParticipant: (expense_id: number, item_name: string, price: number, user_id: number) => void;
}

export const useSettleStore = create<SettleStore>()(
  persist(
    (set) => ({
      selectedItems: [],
      toggleParticipant: (expense_id, item_name, price, user_id) =>
        set((state) => {
          const existing = state.selectedItems.find(
            (i) => i.expense_id === expense_id && i.item_name === item_name
          );

          if (!existing) {
            return {
              selectedItems: [...state.selectedItems, { expense_id, item_name, price, participant_user_ids: [user_id] }],
            };
          }

          const hasUser = existing.participant_user_ids.includes(user_id);
          return {
            selectedItems: state.selectedItems
              .map((i) =>
                i.expense_id === expense_id && i.item_name === item_name
                  ? { ...i, participant_user_ids: hasUser
                      ? i.participant_user_ids.filter((id) => id !== user_id)
                      : [...i.participant_user_ids, user_id] }
                  : i
              )
              .filter((i) => i.participant_user_ids.length > 0),
          };
        }),
    }),
    { name: "settle-store" }
  )
);