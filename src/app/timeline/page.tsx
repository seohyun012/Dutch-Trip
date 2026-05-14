"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/useTripStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Plane, ReceiptText, Triangle, X } from "lucide-react";

export default function TimelinePage() {
  const router = useRouter();
  
  const { tripName, startDate, endDate, schedules, deleteSchedule } = useTripStore();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isDayMenuOpen, setIsDayMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const dayList = useMemo(() => {
    if (!isLoaded || !startDate || !endDate) return [1];

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [1];

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: Math.max(1, diffDays) }, (_, i) => i + 1);
  }, [isLoaded, startDate, endDate]);

  const displaySchedules = useMemo(() => {
    return schedules
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [schedules, selectedDay]);

  const handleDelete = (id: number) => {
    if (window.confirm("이 일정을 삭제하시겠습니까?")) {
      deleteSchedule(id);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-white" />;

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative overflow-hidden font-sans">
      
      {/* --- 고정 상단 영역 (Header + Tabs) --- */}
      <div className="sticky top-0 w-full flex-shrink-0 z-50 flex flex-col shadow-sm">
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

        <div className="relative flex z-10">
          <div className="w-[32px] min-h-[500px] bg-gradient-to-b from-[#3B82F6] via-[#60A5FA] to-[#DBEAFE] rounded-full mr-6 flex-shrink-0" />

          {/* ★ Tailwind 커스텀 클래스 대신 명시적인 인라인 스타일로 gap 지정 (약 3.72%) */}
          <div className="flex-grow flex flex-col" style={{ gap: '3.72%' }}>
            {displaySchedules.length > 0 ? (
              displaySchedules.map((item) => (
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

                  {/* 고정된 크기를 가진 래퍼 (비율 유지) */}
                  <div className="relative w-full aspect-[330/246] flex-shrink-0">
                    
                    {/* SVG 배경 */}
                    <svg 
                      className="absolute inset-0 w-full h-full drop-shadow-sm z-0" 
                      preserveAspectRatio="none" 
                      viewBox="0 0 330 246" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter={`url(#filter0_d_${item.id})`}>
                        <path 
                          d="M26.4631 231C22.3806 231 18.4654 229.525 15.5786 226.899C12.6919 224.274 11.0701 220.713 11.0701 217C11.0492 213.533 12.1172 210.133 14.1487 207.2L23.3845 194.138C25.4406 191.211 26.5332 187.811 26.5332 184.338C26.5332 180.865 25.4406 177.465 23.3845 174.538L14.1487 161.462C12.0926 158.535 11 155.135 11 151.662C11 148.189 12.0926 144.789 14.1487 141.862L23.3845 128.8C25.4406 125.873 26.5332 122.473 26.5332 119C26.5332 115.527 25.4406 112.127 23.3845 109.2L14.1487 96.138C12.0926 93.2115 11 89.811 11 86.338C11 82.865 12.0926 79.4645 14.1487 76.538L23.3845 63.462C25.4406 60.5355 26.5332 57.135 26.5332 53.662C26.5332 50.189 25.4406 46.7885 23.3845 43.862L14.1487 30.8C12.1172 27.8667 11.0492 24.4667 11.0701 21C11.0701 17.287 12.6919 13.726 15.5786 11.1005C18.4654 8.47499 22.3806 7 26.4631 7L303.537 7C307.619 7 311.535 8.47499 314.421 11.1005C317.308 13.726 318.93 17.287 318.93 21C318.951 24.4667 317.883 27.8667 315.851 30.8L306.616 43.862C304.559 46.7885 303.467 50.189 303.467 53.662C303.467 57.135 304.559 60.5355 306.616 63.462L315.851 76.538C317.907 79.4645 319 82.865 319 86.338C319 89.811 317.907 93.2115 315.851 96.138L306.616 109.2C304.559 112.127 303.467 115.527 303.467 119C303.467 122.473 304.559 125.873 306.616 128.8L315.851 141.862C317.907 144.789 319 148.189 319 151.662C319 155.135 317.907 158.535 315.851 161.462L306.616 174.538C304.559 177.465 303.467 180.865 303.467 184.338C303.467 187.811 304.559 191.211 306.616 194.138L315.851 207.2C317.883 210.133 318.951 213.533 318.93 217C318.93 220.713 317.308 224.274 314.421 226.899C311.535 229.525 307.619 231 303.537 231L26.4631 231Z" 
                          fill="white" 
                          shapeRendering="crispEdges"
                        />
                        <path 
                          d="M26.4631 231C22.3806 231 18.4654 229.525 15.5786 226.899C12.6919 224.274 11.0701 220.713 11.0701 217C11.0492 213.533 12.1172 210.133 14.1487 207.2L23.3845 194.138C25.4406 191.211 26.5332 187.811 26.5332 184.338C26.5332 180.865 25.4406 177.465 23.3845 174.538L14.1487 161.462C12.0926 158.535 11 155.135 11 151.662C11 148.189 12.0926 144.789 14.1487 141.862L23.3845 128.8C25.4406 125.873 26.5332 122.473 26.5332 119C26.5332 115.527 25.4406 112.127 23.3845 109.2L14.1487 96.138C12.0926 93.2115 11 89.811 11 86.338C11 82.865 12.0926 79.4645 14.1487 76.538L23.3845 63.462C25.4406 60.5355 26.5332 57.135 26.5332 53.662C26.5332 50.189 25.4406 46.7885 23.3845 43.862L14.1487 30.8C12.1172 27.8667 11.0492 24.4667 11.0701 21C11.0701 17.287 12.6919 13.726 15.5786 11.1005C18.4654 8.47499 22.3806 7 26.4631 7L303.537 7C307.619 7 311.535 8.47499 314.421 11.1005C317.308 13.726 318.93 17.287 318.93 21C318.951 24.4667 317.883 27.8667 315.851 30.8L306.616 43.862C304.559 46.7885 303.467 50.189 303.467 53.662C303.467 57.135 304.559 60.5355 306.616 63.462L315.851 76.538C317.907 79.4645 319 82.865 319 86.338C319 89.811 317.907 93.2115 315.851 96.138L306.616 109.2C304.559 112.127 303.467 115.527 303.467 119C303.467 122.473 304.559 125.873 306.616 128.8L315.851 141.862C317.907 144.789 319 148.189 319 151.662C319 155.135 317.907 158.535 315.851 161.462L306.616 174.538C304.559 177.465 303.467 180.865 303.467 184.338C303.467 187.811 304.559 191.211 306.616 194.138L315.851 207.2C317.883 210.133 318.951 213.533 318.93 217C318.93 220.713 317.308 224.274 314.421 226.899C311.535 229.525 307.619 231 303.537 231L26.4631 231Z" 
                          stroke="black" 
                          strokeOpacity="0.2" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          shapeRendering="crispEdges" 
                        />
                      </g>
                      <defs>
                        <filter id={`filter0_d_${item.id}`} x="0" y="0" width="330" height="246" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="4"/>
                          <feGaussianBlur stdDeviation="5"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${item.id}`}/>
                          <feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${item.id}`} result="shape"/>
                        </filter>
                      </defs>
                    </svg>

                    {/* X (삭제) 버튼 */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-5 right-6 p-1 text-gray-400 hover:text-red-500 transition-colors z-20"
                      aria-label="일정 삭제"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>

                    {/* 텍스트 영역 */}
                    <div className="absolute inset-0 z-10 p-6 px-10 pt-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                      <h3 className="text-xl font-bold mb-2 pr-6">{item.title}</h3>
                      <p className="text-gray-600 font-bold whitespace-pre-wrap leading-snug">
                        {item.content}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-gray-400 mt-10 font-bold">등록된 일정이 없습니다.</div>
            )}
          </div>
        </div>
      </main>

      {/* --- 하단 고정 버튼 (Add Schedule) --- */}
      <footer className="absolute bottom-0 left-0 w-full p-6 pb-8 z-30 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/add-sch')}
          className="w-full h-[65px] bg-[#0C6DFF] rounded-[17px] shadow-[0_8px_30px_rgb(12,109,255,0.3)] text-white flex items-center justify-center transition-all pointer-events-auto"
        >
          <Plus size={40} strokeWidth={3} />
        </motion.button>
      </footer>
    </div>
  );
}