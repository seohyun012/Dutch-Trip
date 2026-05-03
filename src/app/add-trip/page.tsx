"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, Plus, Triangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/store/useTripStore";

export default function AddTripPage() {
  const router = useRouter();
  const setTripData = useTripStore((state) => state.setTripData);

  // 로컬 상태 통합 관리
  const [form, setForm] = useState({
    tripName: "",
    startDate: "",
    endDate: "",
  });
  const [randomCode, setRandomCode] = useState("......");
  const [costs, setCosts] = useState<
    { id: number; item: string; price: string }[]
  >([]);

  const dateRefs = {
    startDate: useRef<HTMLInputElement>(null),
    endDate: useRef<HTMLInputElement>(null),
  };

  // 초기 랜덤 코드 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/generate-code");
        const data = await res.json();
        setRandomCode(data.code);
      } catch {
        setRandomCode("AUZ34W");
      }
    })();
  }, []);

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
    // font-sans 클래스를 추가하여 전역 설정된 Giants 폰트 적용
    <div className="flex flex-col w-full max-w-[430px] min-h-screen bg-white mx-auto text-black relative overflow-hidden font-sans">
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
        className="absolute z-30 flex items-center justify-center"
        style={{ left: '3.8%', top: '10px', width: '32px', height: '32px' }}
      >
        <ChevronLeft size={32} color="#000000" />
      </button>

      <main 
        className="flex flex-col items-center gap-4 px-4 z-10 flex-grow"
        style={{ marginTop: '50px' }}
        >

        {/* 여행 기본 정보 입력 */}
        <input
          placeholder="여행 이름 입력"
          value={form.tripName}
          onChange={(e) => setForm({ ...form, tripName: e.target.value })}
          className="w-full h-20 bg-[#E5E5FE] rounded-2xl text-center text-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all font-bold placeholder:text-[rgba(0,0,0,0.34)]"
        />

        <div className="w-full h-20 bg-[#E5E5FE] rounded-2xl flex items-center justify-center">
          <span className="text-2xl tracking-widest font-bold">
            {randomCode}
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
              onClick={() =>
              (dateRefs as any)[item.key].current?.showPicker()
              }
              className="w-full h-full flex justify-between items-center px-6"
            >
              <div className="flex items-center gap-1 text-2xl font-bold">
                {item.label}
                <Triangle size={18} className="rotate-180 fill-current" />
              </div>
              <span
                className={`text-2xl font-bold ${form[item.key as keyof typeof form] ? "text-black" : "text-black/30"}`}
              >
                {formatDate(form[item.key as keyof typeof form])}
              </span>
            </button>
            <input
              type="date"
              // ref={dateRefs[item.key]} 형식으로 수정 필요
              ref={(dateRefs as any)[item.key]}
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
                className="flex justify-between items-center h-14 px-6 bg-[#E5E5FE] rounded-2xl"
              >
                <input
                  placeholder="항목"
                  value={cost.item}
                  onChange={(e) =>
                    setCosts(
                      costs.map((c) =>
                        c.id === cost.id ? { ...c, item: e.target.value } : c,
                      ),
                    )
                  }
                  className="bg-transparent w-[45%] outline-none text-lg font-bold"
                />
                <input
                  placeholder="금액"
                  value={cost.price}
                  onChange={(e) =>
                    setCosts(
                      costs.map((c) =>
                        c.id === cost.id ? { ...c, price: e.target.value } : c,
                      ),
                    )
                  }
                  className="bg-transparent w-[45%] text-right outline-none text-lg font-bold"
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setCosts([...costs, { id: Date.now(), item: "", price: "" }])
            }
            className="w-full h-14 bg-[#E5E5FE] rounded-2xl flex justify-center items-center text-gray-500"
          >
            <Plus size={32} />
          </motion.button>
        </div>
      </main>

      {/* 최종 제출 버튼 */}
      <footer className="p-5 flex justify-center z-10 bg-gradient-to-t from-white via-white">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCreateTrip}
          className="w-full h-16 bg-[#0C6DFF] rounded-2xl shadow-lg text-white text-2xl font-bold"
        >
          여행 만들기
        </motion.button>
      </footer>
    </div>
  );
}
