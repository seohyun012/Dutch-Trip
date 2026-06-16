"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import { useSettleQuery } from "@/hooks/queries/useSettleQuery";
import { useAuthStore } from "@/store/useAuthStore";

export default function SettlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tripId = Number(id);
  const { data: settlements = [], isLoading } = useSettleQuery(tripId);
  const { userId } = useAuthStore();

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return "0원";
    return price.toLocaleString() + "원";
  };

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen w-full flex items-center justify-center text-xl">
        정산 결과를 계산 중입니다... 💸
      </main>
    );
  }

  // 내가 receiver(결제자)인 카드는 제외 — 내가 받아야 하는 건 표시 안 함
  const filteredSettlements = settlements.filter(
    (data: any) => data.receiver?.user_id !== userId,
  );

  return (
    <main className="bg-white min-h-screen w-full flex flex-col relative">
      <div className="w-full flex flex-col gap-4 min-h-screen">
        <Header title="송금하기" />
        <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-hide">
          {filteredSettlements.length > 0 ? (
            filteredSettlements.map((data: any, index: number) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#E5E5FE] rounded-2xl p-4"
              >
                <div className="mb-4">
                  <p className="text-[#0C6DFF] text-xl">
                    송금 대상: {data.receiver?.nickname}
                  </p>
                  <p className="text-[#0C6DFF] text-xl">
                    {data.receiver?.bank_name}{" "}
                    {data.receiver?.account_number || "계좌 정보 없음"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap text-black text-xl">
                    결제 내역
                  </span>
                  <div className="w-full border-t-2 border-dotted border-black" />
                </div>
                <div className="space-y-2 py-2">
                  {data.relatedExpenses?.map((expense: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-black text-xl"
                    >
                      <span>{expense.expense_title}</span>
                      <span>{formatPrice(expense.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-dotted border-black" />
                <p className="text-[#0C6DFF] text-xl pt-3">{data.tripName}</p>
                <div className="flex justify-between text-black text-xl py-2">
                  <span>나의 총 송금액:</span>
                  <span>{formatPrice(data.amountToSend)}</span>
                </div>
                <div className="w-full h-10 bg-[url('/barcode.png')] bg-repeat-x bg-contain opacity-60" />
              </motion.section>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <span className="text-2xl mb-2">🌱</span>
              <p className="text-xl text-black/40 font-bold">
                정산할 내역이 없습니다.
              </p>
              <p className="text-lg text-black/20 mt-1">
                새로운 지출을 추가해 보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
