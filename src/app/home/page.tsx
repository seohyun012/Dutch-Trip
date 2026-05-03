"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const menus = [
    { title: "가평 여행 DAY-1", primary: true },
    { title: "새로운 여행 추가", primary: false },
    { title: "여행 등록", primary: false },
    { title: "마이페이지", primary: false },
  ];

  return (
    <main className="bg-[#0000FA] min-h-screen w-full flex flex-col items-center p-6 overflow-hidden">
      {/* 상단 로고 및 텍스트 영역 */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-[70vw] max-w-[300px] aspect-square"
        >
          <Image
            src="/home.png"
            alt="홈화면로고"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="flex flex-col items-start w-full max-w-[280px] -mt-10">
          <h1 className="text-[18vw] sm:text-8xl font-black text-white leading-[0.8] italic tracking-tighter">
            Dutch
          </h1>
          <h1 className="text-[18vw] sm:text-8xl font-black text-white leading-[0.8] italic tracking-tighter ml-[15vw]">
            Trip
          </h1>
        </div>
      </section>

      {/* 하단 버튼 메뉴 영역 */}
      <section className="flex flex-col gap-3 w-full max-w-[320px] mb-12">
        {menus.map((menu, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.97 }}
            className={`h-14 w-full rounded-2xl font-bold text-lg shadow-lg transition-colors
              ${menu.primary ? "bg-[#0048FF] text-white" : "bg-white text-[#0000FA]"}
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]`}
          >
            {menu.title}
          </motion.button>
        ))}
      </section>
    </main>
  );
}
