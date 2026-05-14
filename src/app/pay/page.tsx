"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { ChevronLeft} from "lucide-react";
import { motion } from "framer-motion";

// 백엔드 연결 전 가짜 데이터
const paymentData = [
  {
    id: 1,
    payee: "김선태",
    bank: "국민은행",
    account: "84442-02-041592",
    items: [
      { name: "카페", price: 3500 },
      { name: "대성리 피자", price: 20000 },
      { name: "호텔", price: 50000 },
      { name: "놀이공원", price: 6000 },
    ],
    totalAmount: 79500,
    tripName: "가평 여행"
  },
  {
    id: 2,
    payee: "이찬명",
    bank: "국민은행",
    account: "84442-02-041592",
    items: [
      { name: "조식", price: 10000 },
      { name: "라멘집", price: 14000 },
      { name: "아이스크림", price: 3000 },
    ],
    totalAmount: 27000,
    tripName: "가평 여행"
  }
];

export default function SettlePage() {
  const router = useRouter();

  //금액 포맷
  const formatPrice = (price: number) => price.toLocaleString() + "원";

    return (
        <main className = "bg-white min-h-screen w-full flex flex-col relative items-stretch p-5 overflow-hidden justify-between">
            <div className="w-full flex flex-col gap-1">
                
            {/* 상단 뒤로가기 버튼 */}
            <header className="mb-[0.5vh] ">
                <button
                    onClick={() => router.back()}
                    className="-ml-2 p-1">
                    <ChevronLeft size={24} className="text-black"/>
                </button>
            </header>   
                
            {/*영수증 리스트 출력*/}
            <div className="flex-1 overflow-y-auto px-0 space-y-6 scrollbar-hide">
             {paymentData.map((data, index) => (
                <motion.section
                    key={data.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#E5E5FE] rounded-[25px] p-6 relative shadow-md"
                    >
                  {/*결제자 및 계좌*/}    
                    <div className="mb-4">
                   <p className="text-[#0C6DFF] font-bold">결제자: {data.payee}</p>
                   <p className="text-[#0C6DFF] font-extrabold ">
                        {data.bank} {data.account}</p>         
                    </div>
                 
                 {/*결제 내역*/}
                 <div className="flex items-center gap-2 mt-2">
                    <span className="whitespace-nowrap font-bold text-black">결제 내역</span>
                    <div className="w-full border-t-2 border-dotted border-gray-500"></div>
                  </div>

                  {/*아이템 리스트*/}
                  <div className="space-y-3">
                   {data.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-black">
                       <span>{item.name}</span>
                       <span>{formatPrice(item.price)}</span>
                      </div>
                    ))} 
                  </div>

                    <div className="border-t-2 border-dotted border-gray-500 my-3"></div>

                 {/*여행명 및 총 송금액 출력*/}
                    <div className="space-y-2">
                        <p className="text-[#0C6DFF] font-bold text-l">{data.tripName}</p>
                        <div className="flex justify-between items-center text-black">
                            <span>나의 총 송금액:</span>
                            <span>{formatPrice(data.totalAmount) }</span>
                        </div>
                    </div>
                 
                    <div
                         className="w-full h-10 mt-6 bg-[url('/barcode.png')] bg-repeat-x bg-contain opacity-60">          
                    </div>
                </motion.section>
                ))}

            </div>
                
            </div>
        </main>
    );
}