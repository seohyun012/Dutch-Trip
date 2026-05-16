import { create } from "zustand";
import { persist } from "zustand/middleware"; //브라우저 localStorage에 자동 저장해줘. 페이지 새로고침해도 내가 선택한 메뉴가 날아가지 않음.

interface SelectedItem { //내가 선택한 메뉴 하나
  expense_id: number;
  item_name: string;
  price: number;
  participant_user_ids: number[];
}

interface SettleStore { 
  selectedItems: SelectedItem[]; //내가 선택한 메뉴들을 담음
  toggleParticipant: (expense_id: number, item_name: string, price: number, user_id: number) => void;
  //메뉴선택/해제하는 함수
}

export const useSettleStore = create<SettleStore>()(
  persist( // 자동저장
    (set) => ({ //set: 상태 바꾸는 함수
      selectedItems: [], //초기값 비어있음.
      toggleParticipant: (expense_id, item_name, price, user_id) =>
        set((state) => {
          const existing = state.selectedItems.find(
            (i) => i.expense_id === expense_id && i.item_name === item_name //영수증 번호, 메뉴이름이 같으면
          );

          if (!existing) { //아무한테도 선택을 못 받았으면 선택된 바구니에 추가
            return {
              selectedItems: [...state.selectedItems, { expense_id, item_name, price, participant_user_ids: [user_id] }],
            }; //...state.selectedItems: 기존 바구니는 두고, 뒤에 추가
          }

          const hasUser = existing.participant_user_ids.includes(user_id); //메뉴선택자에 내 user_id가 있는지 확인
          return {
            selectedItems: state.selectedItems
              .map((i) =>
                i.expense_id === expense_id && i.item_name === item_name
                  ? { ...i, participant_user_ids: hasUser
                      ? i.participant_user_ids.filter((id) => id !== user_id) //이미 있으면 제거
                      : [...i.participant_user_ids, user_id] } //없으면 추가
                  : i
              )
              .filter((i) => i.participant_user_ids.length > 0), //선택된 메뉴에서 지움.
          };
        }),
    }),
    { name: "settle-store" }
  )
);