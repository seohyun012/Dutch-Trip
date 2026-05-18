"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";

// 백엔드 연결 전 가짜 데이터
const paymentData = [
  {
    id: 1,
    sender: {
      user_id: 2,
      nickname: "김선태",
    },
    receiver: {
      user_id: 1,
      nickname: "최서현",
      bank_name: "국민은행",
      account_number: "84442-02-041592",
    },
    amount_to_send: 79500,
    trip_name: "가평 여행",
    related_expenses: [
      { expense_title: "카페", amount: 3500 },
      { expense_title: "대성리 피자", amount: 20000 },
      { expense_title: "호텔", amount: 50000 },
      { expense_title: "놀이공원", amount: 6000 },
    ],
  },
  {
    id: 2,
    sender: {
      user_id: 3,
      nickname: "이찬명",
    },
    receiver: {
      user_id: 1,
      nickname: "최서현",
      bank_name: "국민은행",
      account_number: "84442-02-041592",
    },
    amount_to_send: 27000,
    trip_name: "가평 여행",
    related_expenses: [
      { expense_title: "카페", amount: 3500 },
      { expense_title: "대성리 피자", amount: 20000 },
      { expense_title: "호텔", amount: 50000 },
      { expense_title: "놀이공원", amount: 6000 },
    ],
  },
];

export default function SettlePage() {
  const router = useRouter();

  //금액 포맷
  const formatPrice = (price: number) => price.toLocaleString() + "원";

  return (
    <main className="bg-white min-h-screen w-full flex flex-col relative">
      <div className="w-full flex flex-col gap-4">
        <Header title="송금하기" />

        {/*영수증 리스트 출력*/}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-hide">
          {paymentData.map((data, index) => (
            <motion.section
              key={data.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} //카드 순서대로 나오게함(시간딜레이)
              className="bg-[#E5E5FE] rounded-2xl p-4 relative"
            >
              {/*결제자 및 계좌*/}
              <div className="mb-4">
                <p className="text-[#0C6DFF] text-xl">
                  결제자: {data.receiver.nickname}
                </p>
                <p className="text-[#0C6DFF] text-xl">
                  {data.receiver.bank_name} {data.receiver.account_number}
                </p>
              </div>

              {/*결제 내역*/}
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap text-black text-xl">
                  결제 내역
                </span>
                <div className="w-full border-t-2 border-dotted border-black"></div>
              </div>

              {/*아이템 리스트*/}
              <div className="space-y-2 py-2">
                {data.related_expenses.map((expense, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-black text-xl"
                  >
                    <span>{expense.expense_title}</span>
                    <span>{formatPrice(expense.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dotted border-black"></div>

              {/*여행명 및 총 송금액 출력*/}
              <p className="text-[#0C6DFF] text-xl pt-3">{data.trip_name}</p>
              <div className="flex justify-between items-center text-black text-xl py-2">
                <span>나의 총 송금액:</span>
                <span>{formatPrice(data.amount_to_send)}</span>
              </div>

              <div className="w-full h-10 bg-[url('/barcode.png')] bg-repeat-x bg-contain opacity-60"></div>
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
}
