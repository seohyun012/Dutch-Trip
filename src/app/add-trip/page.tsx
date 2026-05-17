"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Plus, Triangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/store/useTripStore";
import { useQuery } from "@tanstack/react-query";

// 임시 참여자 목록
const PARTICIPANTS = ["김선태", "최서현", "김옥균"];

export default function AddTripPage() {
  const router = useRouter();
  const setTripData = useTripStore((state) => state.setTripData);

  const [form, setForm] = useState({
    tripName: "",
    startDate: "",
    endDate: "",
  });

  // 비용 리스트 상태
  const [costs, setCosts] = useState<
    { id: number; item: string; price: string; payer: string }[]
  >([]);

  // 현재 열려있는 드롭다운의 ID 추적
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // TanStack Query 랜덤 코드 생성
  const { data: randomCode, isLoading, isError } = useQuery({
    queryKey: ["tripCode"],
    queryFn: async () => {
      const res = await fetch("/api/generate-code");
      if (!res.ok) throw new Error("코드 발급 실패");
      const data = await res.json();
      return data.code;
    },
    refetchOnWindowFocus: false,
  });

  const displayCode = isLoading ? "......" : isError ? "AUZ34W" : randomCode;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-월 -일";
    const [_, m, d] = dateStr.split("-");
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const handleCreateTrip = () => {
    setTripData({
      tripName: form.tripName,
      startDate: form.startDate,
      endDate: form.endDate,
      costs: costs,
    });
    router.push("/timeline");
  };

  return (
    <div className="flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative overflow-hidden font-sans">
      
      {/* ★ 수정됨: 바깥을 눌러서 닫히게 하던 투명 배경(Backdrop)을 삭제했습니다.
        이제 오직 결제자 버튼을 한 번 더 눌러야만 창이 닫힙니다.
      */}

      {/* 시각적 배경 요소 */}
      <div className="absolute w-[299px] bottom-0 left-[-33px] opacity-40 pointer-events-none">
        <Image
          src="/bg-img.png"
          alt="bg"
          width={299}
          height={273}
          className="object-contain"
        />
      </div>

      {/* 상단 이전 버튼*/}
      <button 
        onClick={() => router.back()} 
        className="absolute z-30 flex items-center justify-center hover:opacity-60 transition-opacity"
        style={{ left: '3.8%', top: '10px', width: '32px', height: '32px' }}
      >
        <ChevronLeft size={32} color="#000000" />
      </button>

      <main className="flex flex-col items-center gap-4 px-4 z-10 flex-grow pb-32" style={{ marginTop: '50px' }}>
        
        {/* 여행 기본 정보 입력 */}
        <input
          placeholder="여행 이름 입력"
          value={form.tripName}
          onChange={(e) => setForm({ ...form, tripName: e.target.value })}
          className="w-full h-20 bg-[#E5E5FE] rounded-2xl text-center text-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all font-bold placeholder:text-[rgba(0,0,0,0.34)]"
        />

        <div className="w-full h-20 bg-[#E5E5FE] rounded-2xl flex items-center justify-center">
          <span className="text-2xl tracking-widest font-bold">
            {displayCode}
          </span>
        </div>

        {/* 일정 선택 */}
        {[
          { key: "startDate", label: "여행 시작일" },
          { key: "endDate", label: "여행 마지막일" },
        ].map((item) => (
          <motion.div
            whileTap={{ scale: 0.98 }}
            key={item.key}
            className="relative w-full h-20 bg-[#E5E5FE] rounded-2xl"
          >
            <button
              onClick={() => {
                const input = document.getElementById(`date-${item.key}`) as HTMLInputElement;
                input?.showPicker();
              }}
              className="w-full h-full flex justify-between items-center px-6"
            >
              <div className="flex items-center gap-1 text-2xl font-bold">
                {item.label}
                <Triangle size={18} className="rotate-180 fill-current" />
              </div>
              <span className={`text-2xl font-bold ${form[item.key as keyof typeof form] ? "text-black" : "text-black/30"}`}>
                {formatDate(form[item.key as keyof typeof form])}
              </span>
            </button>
            <input
              id={`date-${item.key}`}
              type="date"
              value={form[item.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
              className="absolute inset-0 opacity-0 pointer-events-none"
            />
          </motion.div>
        ))}

        {/* 동적 고정 비용 리스트 */}
        <div className="w-full flex flex-col gap-2">
          <AnimatePresence>
            {costs.map((cost) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={cost.id}
                className="relative flex items-center h-14 px-4 bg-[#E5E5FE] rounded-2xl z-50"
              >
                <div className="grid grid-cols-3 w-full gap-2 items-center">
                  
                  {/* 1. 항목 입력 */}
                  <input
                    placeholder="항목 입력"
                    value={cost.item}
                    onChange={(e) =>
                      setCosts(prev => prev.map((c) => c.id === cost.id ? { ...c, item: e.target.value } : c))
                    }
                    className="bg-transparent outline-none text-lg font-bold placeholder:text-[rgba(0,0,0,0.34)] w-full"
                  />
                  
                  {/* 2. 금액 입력 (화살표 걷어내고 순수 키보드로만 숫자 입력받음) */}
                  <input
                    placeholder="금액 입력"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={cost.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setCosts(prev => prev.map((c) => c.id === cost.id ? { ...c, price: value } : c));
                    }}
                    className="bg-transparent outline-none text-lg font-bold placeholder:text-[rgba(0,0,0,0.34)] text-center w-full"
                  />
                  
                  {/* 3. 결제자 선택 버튼 */}
                  <div className="relative flex justify-end w-full">
                    <button
                      type="button"
                      // ★ 한 번 누르면 열리고, 한 번 더 누르면 닫히는 토글 기능 유지
                      onClick={() => setOpenDropdownId(openDropdownId === cost.id ? null : cost.id)}
                      className="flex items-center gap-1 text-lg font-bold text-black"
                    >
                      {cost.payer === "" ? "결제자" : cost.payer}
                      <Triangle size={14} className="rotate-180 fill-current mb-[2px]" />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    <AnimatePresence>
                      {openDropdownId === cost.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-[120%] right-[-10px] w-28 bg-[#E5E5FE] rounded-xl shadow-lg flex flex-col overflow-hidden z-[60] border border-white/50"
                        >
                          {PARTICIPANTS.map((person) => (
                            <button
                              key={person}
                              type="button"
                              // ★ 투명 배경막이 사라졌으므로, 안전하게 onClick으로 되돌림
                              onClick={(e) => {
                                e.stopPropagation();
                                setCosts(prev =>
                                  prev.map((c) =>
                                    c.id === cost.id ? { ...c, payer: person } : c
                                  )
                                );
                                setOpenDropdownId(null);
                              }}
                              className={`w-full py-2 text-lg font-bold transition-colors cursor-pointer ${
                                cost.payer === person ? "bg-[#7BA8FF] text-black" : "hover:bg-[#85B5FF]"
                              }`}
                            >
                              {person}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 리스트 추가 버튼 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setCosts(prev => [...prev, { id: Date.now(), item: "", price: "", payer: "" }])
            }
            className="w-full h-14 bg-[#E5E5FE] rounded-2xl flex justify-center items-center text-black"
          >
            <Plus size={32} strokeWidth={2.5} />
          </motion.button>
        </div>
      </main>

      {/* 최종 제출 버튼 */}
      <footer className="absolute bottom-[40px] w-full flex justify-center z-30 pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateTrip}
          className="w-[352px] h-[65px] bg-[#0C6DFF] rounded-[17px] shadow-[inset_0px_4px_10px_rgba(0,0,0,0.25)] text-white flex items-center justify-center transition-all pointer-events-auto"
          style={{ fontFamily: 'Giants', fontWeight: 700, fontSize: '24px' }}
        >
          여행 만들기
        </motion.button>
      </footer>
    </div>
  );
}