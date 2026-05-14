"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/useTripStore";
import { ChevronLeft, Triangle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AddSchedulePage() {
  const router = useRouter();
  const { startDate, addSchedule } = useTripStore();

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    content: "",
  });

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-월 -일";
    const [_, m, d] = dateStr.split("-");
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "-/-";
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.time) {
      alert("일정 이름, 날짜, 시간을 모두 입력해주세요.");
      return;
    }

    let day = 1;
    if (startDate && form.date) {
      const start = new Date(startDate);
      const selected = new Date(form.date);
      const diffTime = selected.getTime() - start.getTime();
      day = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (day < 1) day = 1;
    }

    addSchedule({
      id: Date.now(),
      day: day,
      title: form.title,
      time: form.time,
      content: form.content,
    });

    router.push("/timeline");
  };

  // 공통으로 적용할 Giants 폰트 스타일 객체
  const giantsFontStyle = {
    fontFamily: 'Giants',
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '34px',
  };

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative font-sans overflow-hidden">
      
      {/* 1. 상단 이전 버튼 */}
      <button 
        onClick={() => router.back()} 
        className="absolute z-30 flex items-center justify-center"
        style={{ left: '3.8%', top: '10px', width: '32px', height: '32px' }}
      >
        <ChevronLeft size={32} color="#000000" />
      </button>

      {/* 2. 시각적 배경 요소 */}
      <div className="absolute w-[299px] bottom-0 left-[-33px] opacity-40 pointer-events-none z-0">
        <Image 
        src="/bg-img.png" 
        alt="bg" 
        width={299} 
        height={273} 
        className="object-contain" />
      </div>

      {/* 3. 메인 폼 영역 */}
      <main 
        className="flex flex-col items-center w-full z-20 relative"
        style={{ 
          marginTop: '50px', 
          gap: '15px' 
        }}
      >
        
        {/* 일정 이름 (가운데 정렬) */}
        <input
          type="text"
          placeholder="일정 이름 입력"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-[#E5E5FE] text-center outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-[rgba(0,0,0,0.34)]"
          style={{ 
            width: '92.3%', height: '88px', borderRadius: '15px',
            ...giantsFontStyle 
          }}
        />

        {/* 날짜 선택 */}
        <button 
          onClick={() => dateRef.current?.showPicker()}
          className="relative bg-[#E5E5FE] flex justify-between items-center px-6"
          style={{ width: '92.3%', height: '88px', borderRadius: '15px' }}
        >
          <div className="flex items-center gap-2" style={giantsFontStyle}>
            날짜 
            {/* CSS에 명시된 역삼각형 크기 적용 (약 15~17px) */}
            <Triangle size={15} className="rotate-180 fill-current mb-[2px]" />
          </div>
          <span 
            className={form.date ? "text-black" : "text-[rgba(0,0,0,0.34)]"}
            style={giantsFontStyle}
          >
            {formatDate(form.date)}
          </span>
          <input 
            type="date" 
            ref={dateRef}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="absolute inset-0 opacity-0 pointer-events-none" 
          />
        </button>

        {/* 시간 선택 */}
        <button 
          onClick={() => timeRef.current?.showPicker()}
          className="relative bg-[#E5E5FE] flex justify-between items-center px-6"
          style={{ width: '92.3%', height: '88px', borderRadius: '15px' }}
        >
          <div className="flex items-center gap-2" style={giantsFontStyle}>
            시간 
            <Triangle size={15} className="rotate-180 fill-current mb-[2px]" />
          </div>
          <span 
            className={form.time ? "text-black" : "text-[rgba(0,0,0,0.34)]"}
            style={giantsFontStyle}
          >
            {formatTime(form.time)}
          </span>
          <input 
            type="time" 
            ref={timeRef}
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="absolute inset-0 opacity-0 pointer-events-none" 
          />
        </button>

        {/* 일정 내용 */}
        <textarea
          placeholder="일정 내용 입력"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="bg-[#E5E5FE] p-6 outline-none resize-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-[rgba(0,0,0,0.34)]"
          style={{ 
            width: '92.3%', height: '187px', borderRadius: '15px',
            ...giantsFontStyle 
          }}
        />
      </main>

      {/* 4. 하단 일정 추가 버튼 */}
      <footer className="absolute bottom-0 left-0 w-full p-6 pb-8 z-30 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full h-[65px] bg-[#0C6DFF] rounded-[17px] shadow-[0_8px_30px_rgb(12,109,255,0.3)] text-white flex items-center justify-center transition-all pointer-events-auto"
          style={{ fontFamily: 'Giants', fontWeight: 700, fontSize: '24px' }}
        >
          일정 추가하기
        </motion.button>
      </footer>
    </div>
  );
}