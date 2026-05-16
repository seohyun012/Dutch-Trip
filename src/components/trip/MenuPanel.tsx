"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ExpenseItem } from "@/types"; //메뉴 하나
import { useSettleStore } from "@/store/useSettleStore";
import type { Participant } from "@/types";

interface Props {
  //이 컴포넌트가 받아야하는 데이터이름:타입
  items: ExpenseItem[];
  currentUserId: number; //현재유저
  expenseId: number;
  members: Participant[];
  readOnly?: boolean;
}

export default function MenuPanel({
  items,
  currentUserId,
  expenseId,
  members,
  readOnly = false,
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
        const selected = !readOnly && isSelected(item.item_name);

        if (readOnly) {
          return (
            <div
              key={idx}
              className="px-1 py-2 flex items-center text-black"
              style={{ backgroundColor: "#E5E5FE" }}
            >
              <span className="flex-1 text-xl">{item.item_name}</span>
              <span className="text-xl">{item.price.toLocaleString()}원</span>
            </div>
          );
        }

        return (
          <div
            key={idx}
            onClick={() => {
              toggleParticipant(
                expenseId,
                item.item_name,
                item.price,
                currentUserId,
              );
            }}
            className="px-1 py-1 cursor-pointer" //cursor-pointer: 마우스 올리면 손가락 모양으로 바뀜
            style={{ backgroundColor: selected ? "#85B5FF" : "#E5E5FE" }}
          >
            <div className="flex items-center text-black">
              <span className="flex-1 text-xl">{item.item_name}</span>
              <span className="text-xl">
                {item.price.toLocaleString()}원 {/*천 단위마다 , 찍기*/}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(isOpen ? null : idx); //열려있으면 닫고(null)
                }}
                className="text-black"
              >
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>

            {isOpen && (
              <div className="text-lg text-black">
                {(() => {
                  const found = selectedItems.find(
                    //선택된 메뉴 바구니에서 이 메뉴 찾기
                    (i) =>
                      i.expense_id === expenseId &&
                      i.item_name === item.item_name,
                  );
                  const names = found?.participant_user_ids
                    .map(
                      (id) => members.find((m) => m.user_id === id)?.nickname, // id를 닉네임으로 변환
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
