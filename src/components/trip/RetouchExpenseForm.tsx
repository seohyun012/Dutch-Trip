"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense, ExpenseItem, Participant } from "@/types";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import { useExpenseStore } from "@/store/useExpenseStore";

interface Props {
  tripId: number;
  expense: Expense;
  members: Participant[]; //여행맴버
}

export default function RetouchExpenseForm({
  tripId,
  expense,
  members,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(expense.title);
  const [totalAmount, setTotalAmount] = useState(expense.total_amount);
  const [paymentTime, setPaymentTime] = useState(expense.payment_time ?? "");
  const [items, setItems] = useState<ExpenseItem[]>(expense.items); //메뉴 목록 수정
  const [payerUserId, setPayerUserId] = useState(expense.payer.user_id);
  const { updateExpense } = useExpenseStore();

  function handleItemChange(
    idx: number,
    field: "item_name" | "price",
    value: string,
  ) {
    setItems((prev) => {
      //prev: 현재아이템배열
      const updated = prev.map((item, i) =>
        i === idx
          ? { ...item, [field]: field === "price" ? Number(value) : value } //기존데이터유지하고, 바꿀 field만 교체
          : item,
      );
      // 가격 바뀌면 총금액 자동 계산
      if (field === "price") {
        setTotalAmount(updated.reduce((sum, item) => sum + item.price, 0));
      }
      return updated;
    });
  }

  function handleSubmit() {
    const payer = members.find((m) => m.user_id === payerUserId)!; // 멤버 목록에서 선택된 결제자 ID랑 일치하는 사람 찾기
    updateExpense({
      ...expense,
      title,
      total_amount: totalAmount,
      payment_time: paymentTime,
      items,
      item_count: items.length,
      payer,
    });
    router.back();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="글로 쓰기" />

      {/* 영수증 박스 */}
      <div className="rounded-xl p-4 m-4 bg-[#E5E5FE]">
        {/* 제목 + 총금액 */}
        <div className="flex justify-between items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl text-[#0C6DFF] bg-transparent w-1/2" //bg-transparent: 배경 투명, w-1/2: 너비를 부모 절반
          />
          <input
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            type="number"
            className="text-xl text-[#0C6DFF] w-1/3 text-right"
          />
        </div>

        <hr className="border-dashed border-black my-2" />

        {/* 메뉴 목록 */}
        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-xl text-black py-1"
            >
              <input
                value={item.item_name}
                onChange={(e) =>
                  handleItemChange(idx, "item_name", e.target.value)
                }
                className="bg-transparent w-1/2"
              />
              <input
                value={item.price}
                onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                type="number"
                className="bg-transparent w-1/3 text-right"
              />
            </div>
          ))}
        </div>

        <hr className="border-dashed border-black my-2" />

        {/* 날짜 */}
        <input
          value={paymentTime}
          onChange={(e) => setPaymentTime(e.target.value)}
          type="datetime-local"
          className="text-xl text-[#0C6DFF] bg-transparent mb-2"
        />
        <img src="/barcode.png" alt="barcode" className="w-full" />
      </div>

      {/* 결제자 선택 */}
      <div className="mx-4 bg-[#E5E5FE] rounded-xl p-4">
        <p className="text-xl text-black mb-2">결제자 선택</p>
        <div className="flex gap-2 flex-wrap">
          {members.map((m) => (
            <button
              key={m.user_id}
              onClick={() => setPayerUserId(m.user_id)}
              className="px-4 py-1 text-xl rounded-lg"
              style={{
                backgroundColor:
                  payerUserId === m.user_id ? "#85B5FF" : "#ffffff",
                color: "#000000",
              }}
            >
              {m.nickname}
            </button>
          ))}
        </div>
      </div>

      <Button label="이대로 반영하기" onClick={handleSubmit} fixed />
    </div>
  );
}
