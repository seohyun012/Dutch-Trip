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

  const [settlements, setSettlements] = useState<any[]>(paymentData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const token = localStorage.getItem("access_token");
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/trips/1/settlements`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("정산 결과 데이터 조회 성공:", data);
        if (data.data && data.data.length > 0) {
            setSettlements(data.data);
          } else {
            setSettlements(paymentData);
          }
        } else {
          console.error(`백엔드 정산 조회 실패 상태코드: ${res.status}`);
          setSettlements(paymentData); 
        }
      } catch (error) {
        console.error("정산 데이터 로딩 실패:", error);
        setSettlements(paymentData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettlements();
  }, []);
  // 금액 포맷 (기존 로직 유지)
 const formatPrice = (price: number) => {
    if (!price) return "0원";
    return price.toLocaleString() + "원";
  };

  // 로딩 중일 때 처리
  if (isLoading) {
    return <main className="bg-white min-h-screen w-full flex items-center justify-center text-xl">정산 결과를 계산 중입니다... 💸</main>;
  }

  return (
    <main className="bg-white min-h-screen w-full flex flex-col relative">
      <div className="w-full flex flex-col gap-4 min-h-screen">
        <Header title="송금하기" />

        {/*영수증 리스트 출력*/}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-hide">
          { settlements && settlements.length > 0 ? (
            settlements.map((data, index) => (
            <motion.section
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#E5E5FE] rounded-2xl p-4 relative"
            >
              {/*결제자 및 계좌*/}
              <div className="mb-4">
                <p className="text-[#0C6DFF] text-xl">
                  결제자: {data.receiver?.nickname}
                </p>
                <p className="text-[#0C6DFF] text-xl">
                  {data.receiver?.bank_name} {data.receiver?.account_number || "계좌 정보 없음"}
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
                {data.related_expenses?.map((expense: any, idx: number) => (
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
          ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <span className="text-2xl mb-2">🌱</span>
              <p className="text-xl text-black/40 font-bold">정산할 내역이 없습니다.</p>
              <p className="text-lg text-black/20 mt-1">새로운 지출을 추가해 보세요!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
