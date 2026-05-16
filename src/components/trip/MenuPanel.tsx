"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ExpenseItem } from "@/types";
import { useSettleStore } from "@/store/useSettleStore";

interface Props {
  items: ExpenseItem[];
  currentUserId: number;
  currentUserNickname: string; // 삭제해도 됨
  expenseId: number;
  members: { user_id: number; nickname: string; role: string }[]; // 추가
}

export default function MenuPanel({
  items,
  currentUserId,
  currentUserNickname,
  expenseId,
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { selectedItems, toggleParticipant } = useSettleStore();

  function isSelected(itemName: string) {
    return selectedItems.some(
      (i) => i.expense_id === expenseId && i.item_name === itemName,
    );
  }

  return (
    <div>
      {items.map((item, idx) => {
        const isOpen = expanded === idx;
        const selected = isSelected(item.item_name);

        return (
          <div
            key={idx}
            onClick={() =>
              toggleParticipant(
                expenseId,
                item.item_name,
                item.price,
                currentUserId,
              )
            }
            className="py-2.5 cursor-pointer"
            style={{ backgroundColor: selected ? "#85B5FF" : "white" }}
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
                {selected ? currentUserNickname : "선택된 인원 없음"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
