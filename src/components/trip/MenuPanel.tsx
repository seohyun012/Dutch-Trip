"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ExpenseItem } from "@/types"; //메뉴 하나
import { useUpdateExpenseMutation } from "@/hooks/mutations/useExpenseMutation";
import type { Expense } from "@/types";
import type { Participant } from "@/types";

interface Props {
  //이 컴포넌트가 받아야하는 데이터이름:타입
  items: ExpenseItem[];
  currentUserId: number; //현재유저
  expenseId: number;
  members: Participant[];
  readOnly?: boolean;
  expense: Expense;
  tripId: number;
}

export default function MenuPanel({
  items,
  currentUserId,
  expenseId,
  members,
  readOnly = false, //안넘겨주면 false
  expense,
  tripId,
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null); //각메뉴 먹은사람 펼치기
  const [localItems, setLocalItems] = useState<ExpenseItem[]>(items);
  const { mutate: updateExpense } = useUpdateExpenseMutation(tripId);

  return (
    <div>
      {localItems.map((item, idx) => {
        //items:영수증 안 메뉴목록
        const isOpen = expanded === idx;
        const selected =
          !readOnly &&
          item.participants.some((p) => p.user_id === currentUserId);

        if (readOnly) {
          return (
            <div
              key={idx}
              className="px-1 py-2 flex items-center text-black"
              style={{ backgroundColor: "#E5E5FE" }}
            >
              <span className="flex-1 text-xl px-1">{item.item_name}</span>
              <span className="text-xl px-1">
                {item.price.toLocaleString()}원
              </span>
            </div>
          );
        }

        return (
          <div
            key={idx}
            onClick={() => {
              const updated = localItems.map((i) => {
                if (i.item_name !== item.item_name) return i;
                const hasUser = i.participants.some(
                  (p) => p.user_id === currentUserId,
                );
                return {
                  ...i,
                  participants: hasUser
                    ? i.participants.filter((p) => p.user_id !== currentUserId)
                    : [
                        ...i.participants,
                        {
                          user_id: currentUserId,
                          nickname:
                            members.find((m) => m.user_id === currentUserId)
                              ?.nickname ?? "",
                        },
                      ],
                };
              });
              setLocalItems(updated);
              updateExpense({
                expenseId,
                body: {
                  title: expense.title,
                  total_amount: expense.total_amount,
                  expense_type: expense.expense_type,
                  split_type: expense.split_type,
                  payment_time: expense.payment_time,
                  payer_user_id: expense.payer.user_id,
                  items: updated.map((i) => ({
                    item_name: i.item_name,
                    price: i.price,
                    participant_user_ids: i.participants.map((p) => p.user_id),
                  })),
                },
              });
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
              <div className="text-base text-black">
                {(() => {
                  const names = item.participants
                    .map((p) => p.nickname)
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
