"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ExpenseItem } from "@/types"; //메뉴 하나
import { useSettleStore } from "@/store/useSettleStore";

interface Props {
  //이 컴포넌트가 받아야하는 데이터이름:타입
  items: ExpenseItem[];
  currentUserId: number; //현재유저
  expenseId: number;
  members: { user_id: number; nickname: string; role: string }[];
}

export default function MenuPanel({
  items,
  currentUserId,
  expenseId,
  members,
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null); //각메뉴 먹은사람 펼치기
  const { selectedItems, toggleParticipant } = useSettleStore(); //toggleParticipant: 메뉴선택/해제하는 함수

  function isSelected(itemName: string) {
    return selectedItems.some(
      //some: 배열에 조건에 맞는 요소가 하나라도 있으면 true 반환
      (i) => i.expense_id === expenseId && i.item_name === itemName, //같은 영수증, 같은 메뉴
    );
  } //이게 true면 메뉴가 선택된거고, 파란배경으로 바뀜.

  return (
    <div>
      {items.map((item, idx) => {
        //items:영수증 안 메뉴목록
        const isOpen = expanded === idx;
        const selected = isSelected(item.item_name);

        return (
          <div
            key={idx}
            onClick={() =>
              toggleParticipant(
                //어떤 메뉴를 누르면 이 값을 함수에게 넘겨준다.
                expenseId,
                item.item_name,
                item.price,
                currentUserId,
              )
            }
            className="px-1 py-1 cursor-pointer" //cursor-pointer: 마우스 올리면 손가락 모양으로 바뀜
            style={{ backgroundColor: selected ? "#85B5FF" : "#E5E5FE" }}
          >
            <div className="flex items-center">
              <span className="flex-1 text-base">{item.item_name}</span>
              <span className="text-base text-gray-700 mr-2">
                {item.price.toLocaleString()}원
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(isOpen ? null : idx);
                }}
                className="text-gray-400"
              >
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {isOpen && (
              <div className="mt-1 text-sm text-gray-500">
                {(() => {
                  const found = selectedItems.find(
                    (i) =>
                      i.expense_id === expenseId &&
                      i.item_name === item.item_name,
                  );
                  const names = found?.participant_user_ids
                    .map(
                      (id) => members.find((m) => m.user_id === id)?.nickname,
                    )
                    .filter(Boolean)
                    .join(", ");
                  return names || "선택된 인원 없음";
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
