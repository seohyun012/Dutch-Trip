"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense, ExpenseItem, Participant } from "@/types";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import { Plus } from "lucide-react";
import { useUpdateExpenseMutation } from "@/hooks/mutations/useExpenseMutation";

interface Props {
  tripId: number;
  expense: Expense;
  members: Participant[];
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
  const [items, setItems] = useState<ExpenseItem[]>(expense.items);
  const [payerUserId, setPayerUserId] = useState(expense.payer.user_id);
  const { mutateAsync: updateExpense } = useUpdateExpenseMutation(tripId);

  function handleItemChange(
    idx: number,
    field: "item_name" | "price",
    value: string,
  ) {
    setItems((prev) => {
      const updated = prev.map((item, i) =>
        i === idx
          ? { ...item, [field]: field === "price" ? Number(value) : value }
          : item,
      );
      if (field === "price") {
        setTotalAmount(updated.reduce((sum, item) => sum + item.price, 0));
      }
      return updated;
    });
  }

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      { item_name: "", price: 0, participants: [] },
    ]);
  }

  async function handleSubmit() {
    await updateExpense({
      expenseId: expense.expense_id,
      body: {
        title,
        total_amount: totalAmount,
        expense_type: expense.expense_type,
        split_type: expense.split_type,
        payment_time: paymentTime || undefined,
        payer_user_id: payerUserId,
        items: items.map((item) => ({
          item_name: item.item_name,
          price: item.price,
          participant_user_ids: item.participants.map((p) => p.user_id),
        })),
      },
    });
    router.push(`/trip/${tripId}?tab=영수증`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="글로 쓰기" />
      <div className="rounded-xl p-4 m-4 bg-[#E5E5FE]">
        <div className="flex justify-between items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl text-[#0C6DFF] bg-transparent w-1/2 outline-none"
          />
          {/* 총금액은 메뉴 가격 합산으로 자동계산 — 읽기 전용 */}
          <p className="text-xl text-[#0C6DFF]">
            {totalAmount.toLocaleString()}원
          </p>
        </div>

        <hr className="border-dashed border-black my-2" />

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
                className="bg-transparent w-1/2 outline-none"
              />
              <input
                value={item.price}
                onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                type="number"
                className="bg-transparent w-1/3 text-right outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAddItem}
          className="w-full py-2 text-xl bg-white rounded-lg my-2 flex items-center justify-center"
        >
          <Plus size={25} strokeWidth={2} />
        </button>

        <hr className="border-dashed border-black my-2" />

        <input
          value={paymentTime}
          onChange={(e) => setPaymentTime(e.target.value)}
          type="datetime-local"
          className="text-xl text-[#0C6DFF] bg-transparent mb-2"
        />
        <img src="/barcode.png" alt="barcode" className="w-full" />
      </div>

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
