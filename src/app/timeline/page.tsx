"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/useTripStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Plane, ReceiptText, Triangle } from "lucide-react";

export default function TimelinePage() {
  const router = useRouter();
  
  // Zustand 스토어에서 데이터 가져오기
  const { tripName, startDate, endDate, schedules } = useTripStore();
  
  // 클라이언트 사이드 렌더링 확인 (Hydration 방지)
  const [isLoaded, setIsLoaded] = useState(false);
  // 현재 선택된 DAY
  const [selectedDay, setSelectedDay] = useState(1);
  // DAY 선택 드롭다운 열림 상태
  const [isDayMenuOpen, setIsDayMenuOpen] = useState(false);

  // 1. 컴포넌트 마운트 시 로드 상태 업데이트
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 2. 전체 여행 기간 계산 (useMemo를 사용하여 성능 최적화)
  const dayList = useMemo(() => {
    if (!isLoaded || !startDate || !endDate) return [1];

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 유효하지 않은 날짜인 경우 기본값 1일 반환
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [1];

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 최소 1일은 보장하는 배열 생성
    return Array.from({ length: Math.max(1, diffDays) }, (_, i) => i + 1);
  }, [isLoaded, startDate, endDate]);

  // 3. 하이드레이션 전에는 빈 화면 혹은 스켈레톤을 보여줌
  if (!isLoaded) return <div className="min-h-screen bg-white" />;

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative overflow-hidden font-sans">
      
      {/* --- 고정 상단 영역 (Header + Tabs) --- */}
      <div className="relative w-full flex-shrink-0 z-30">
        {/* 상단 헤더 (54px) */}
        <header className="relative h-[54px] bg-[#0C6DFF] flex items-center px-4">
          <button 
            onClick={() => router.back()} 
            className="p-1 text-white hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={32} />
          </button>
          <h1 
            className="absolute left-1/2 -translate-x-1/2 font-bold text-[24px] text-white whitespace-nowrap"
            style={{ fontFamily: 'Giants', lineHeight: '34px' }}
          >
            {tripName || "여행이름"}
          </h1>
        </header>

        {/* 탭 메뉴 (70px) */}
        <div className="flex w-full h-[70px]">
          <div className="flex-1 bg-[#0000FA] flex items-center justify-center gap-2">
            <span className="font-bold text-[24px] text-white" style={{ fontFamily: 'Giants' }}>일정</span>
            <Plane size={32} color="#FFFFFF" />
          </div>
          <div className="flex-1 bg-[#C3D1E6] flex items-center justify-center">
            <span className="font-bold text-[24px] text-white opacity-80" style={{ fontFamily: 'Giants' }}>영수증</span>
            <ReceiptText size={32} color="#FFFFFF" className="ml-2 opacity-50" />
          </div>
        </div>
      </div>

      {/* --- 메인 콘텐츠 영역 (Scrollable) --- */}
      <main className="flex-grow relative px-6 pt-8 bg-white overflow-y-auto pb-40">
        
        {/* DAY 선택 드롭다운 섹션 */}
        <div className="relative z-40 mb-8">
          <button 
            onClick={() => setIsDayMenuOpen(!isDayMenuOpen)}
            className="flex items-center gap-2 text-2xl font-bold italic"
          >
            DAY {selectedDay}
            <Triangle 
              size={18} 
              className={`fill-current transition-transform duration-300 ${isDayMenuOpen ? "rotate-0" : "rotate-180"}`} 
            />
          </button>

          <AnimatePresence>
            {isDayMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-10 left-0 w-32 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                {dayList.map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDayMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left font-bold text-lg hover:bg-blue-50 transition-colors ${
                      selectedDay === day ? "text-[#0C6DFF] bg-blue-50" : "text-black"
                    }`}
                  >
                    DAY {day}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 배경 로고 이미지 (DT.png) */}
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 z-0"
          style={{
            width: '186px', height: '167px',
            backgroundImage: 'url(/DT.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        {/* 타임라인 바와 리스트 */}
        <div className="relative flex z-10">
          <div className="w-[32px] min-h-[500px] bg-gradient-to-b from-[#3B82F6] via-[#60A5FA] to-[#DBEAFE] rounded-full mr-6 flex-shrink-0" />

          <div className="flex-grow flex flex-col gap-10">
            {schedules.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                {/* 시간 표시 */}
                <div className="absolute left-[-56px] top-4 text-center font-bold text-lg leading-tight z-10">
                  {item.time.split(':')[0]} <br/> {item.time.split(':')[1]}
                </div>

                {/* 일정 카드 */}
                <div 
                  className="w-full bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-100"
                  style={{ borderRadius: '30px 60px 30px 60px' }}
                >
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-bold whitespace-pre-wrap leading-snug">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* --- 하단 고정 버튼 (Add Schedule) --- */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 z-30 bg-gradient-to-t from-white via-white/80 to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/add-sch')}
          className="w-full h-16 bg-[#0C6DFF] rounded-2xl shadow-[0_8px_30px_rgb(12,109,255,0.3)] text-white flex items-center justify-center transition-all"
        >
          <Plus size={40} strokeWidth={3} />
        </motion.button>
      </footer>
    </div>
  );
}