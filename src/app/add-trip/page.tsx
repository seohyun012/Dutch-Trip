"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import localFont from "next/font/local";
import Image from "next/image";

// 모든 텍스트에 Giants-Bold 적용
const giantsBold = localFont({
  src: "../../../public/fonts/Giants-Bold.ttf",
  display: "swap",
});

export default function AddTripPage() {
  const router = useRouter();
  const [tripName, setTripName] = useState("");
  const [randomCode, setRandomCode] = useState("......");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [costs, setCosts] = useState<{ id: number; item: string; price: string }[]>([]);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { //백엔드 API 로 랜덤코드 받아오는.. 
    const fetchRandomCode = async () => {
      try {
        const response = await fetch("/api/generate-code"); 
        const data = await response.json();
        setRandomCode(data.code);
      } catch (error) {
        setRandomCode("AUZ34W"); 
      }
    };
    fetchRandomCode();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-월 -일";
    const [_, month, day] = dateStr.split("-");
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };

  const addCostField = () => {
    setCosts([...costs, { id: Date.now(), item: "", price: "" }]);
  };

  const updateCost = (id: number, field: "item" | "price", value: string) => {
    setCosts(costs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleCreateTrip = () => {
    // 여기에 나중에 서버로 데이터를 보내는 로직을 넣을 거
    console.log({ tripName, startDate, endDate, costs });
    router.push("/timeline");
  };

  return (
    <div className={`${giantsBold.className} flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative overflow-x-hidden`}>
      
      {/* 배경 이미지*/}
      <div className="absolute w-[299px] h-[273px] left-[-33px] bottom-0 z-0 pointer-events-none opacity-60">
        <Image 
          src="/bg-img.png" 
          alt="Background Decoration" 
          width={299} 
          height={273} 
          className="object-contain"
        />
      </div>

      {/* 1. 상단 헤더 */}
      <div className="relative w-full h-[52px] z-10">
        <button onClick={() => window.history.back()} className="absolute left-[3.82%] top-[10px] w-[32px] h-[32px] flex items-center justify-center bg-white/50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* 2. 메인 입력 영역 */}
      <div className="flex flex-col items-center w-full gap-y-[15px] z-10 flex-grow">
        
        {/* 여행 이름 입력 */}
        <input 
          type="text"
          placeholder="여행 이름 입력" 
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="w-[92.37%] h-[88px] mt-[8px] bg-[#E5E5FE] rounded-[15px] text-center text-[24px] leading-[34px] placeholder:text-[rgba(0,0,0,0.34)] outline-none" 
        />

        {/* 랜덤 코드 */}
        <div className="w-[92.37%] h-[88px] bg-[#E5E5FE] rounded-[15px] flex items-center justify-center">
          <span className="text-[24px] leading-[34px]">{randomCode}</span>
        </div>

        {/* 여행 시작일 */}
        <div className="relative w-[92.37%] h-[88px] bg-[#E5E5FE] rounded-[15px]">
          <button onClick={() => startInputRef.current?.showPicker()} className="w-full h-full flex items-center relative">
            <div className="absolute left-[7.4%] flex items-center gap-1">
              <span className="text-[24px] leading-[34px]">여행 시작일</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
            </div>
            <div className={`absolute left-[69.7%] text-[24px] leading-[34px] ${startDate ? "text-[#000000]" : "text-[rgba(0,0,0,0.34)]"}`}>
              {formatDate(startDate)}
            </div>
          </button>
          <input type="date" ref={startInputRef} onChange={(e) => setStartDate(e.target.value)} className="absolute opacity-0 pointer-events-none" />
        </div>

        {/* 여행 마지막일 */}
        <div className="relative w-[92.37%] h-[88px] bg-[#E5E5FE] rounded-[15px]">
          <button onClick={() => endInputRef.current?.showPicker()} className="w-full h-full flex items-center relative">
            <div className="absolute left-[7.4%] flex items-center gap-1">
              <span className="text-[24px] leading-[34px]">여행 마지막일</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
            </div>
            <div className={`absolute left-[69.7%] text-[24px] leading-[34px] ${endDate ? "text-[#000000]" : "text-[rgba(0,0,0,0.34)]"}`}>
              {formatDate(endDate)}
            </div>
          </button>
          <input type="date" ref={endInputRef} onChange={(e) => setEndDate(e.target.value)} className="absolute opacity-0 pointer-events-none" />
        </div>

        {/* 고정 비용 입력 블록 */}
        {costs.map((cost) => (
          <div key={cost.id} className="flex justify-between items-center w-[92.37%] h-[58px] px-[25px] bg-[#E5E5FE] rounded-[15px]">
            <input placeholder="항목 입력" className="bg-transparent w-[45%] outline-none text-[18px] placeholder:text-[rgba(0,0,0,0.34)]" value={cost.item} onChange={(e) => updateCost(cost.id, "item", e.target.value)} />
            <input placeholder="금액 입력" className="bg-transparent w-[45%] text-right outline-none text-[18px] placeholder:text-[rgba(0,0,0,0.34)]" value={cost.price} onChange={(e) => updateCost(cost.id, "price", e.target.value)} />
          </div>
        ))}

        {/* + 추가 버튼 */}
        <button 
          onClick={addCostField} 
          className="w-[92.37%] h-[58px] bg-[#E5E5FE] rounded-[15px] flex justify-center items-center text-gray-600 active:bg-[#d5d5f8] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>

      {/*  하단 여행 만들기 버튼  */}
      <div className="w-full pb-[30px] pt-[40px] flex justify-center z-10 bg-gradient-to-t from-white to-transparent">
        <button onClick={handleCreateTrip}
        className="w-[89.56%] h-[65px] bg-[#0C6DFF] rounded-[17px] shadow-[inset_0px_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center text-[#FFFFFF] text-[24px] leading-[34px] active:scale-[0.98] transition-transform">
          여행 만들기
        </button>
        
      </div>
    </div>
  );
}