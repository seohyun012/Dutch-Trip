"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <main className="bg-[#0000FA] min-h-screen w-full flex flex-col items-center justify-between p-4 overflow-hidden">
      {/* 로고 영역: 중앙 배치 유도 */}
      <div className="flex-1 flex items-center justify-center w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-[800px] aspect-square"
        >
          <Image
            src="/login.png"
            alt="로그인로고"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>

      {/* 로그인 버튼 영역: 하단 고정 */}
      <div className="w-full max-w-[320px] mb-20">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="h-14 w-full bg-[#FEE500] flex items-center justify-center rounded-2xl gap-3 
                     shadow-xl active:brightness-90 transition-all"
        >
          <MessageCircle className="w-6 h-6 fill-black stroke-0 scale-x-[-1]" />
          <span className="text-black text-lg font-bold">카카오 로그인</span>
        </motion.button>

        <p className="text-white/60 text-center mt-6 text-sm">
          서비스 이용을 위해 로그인이 필요합니다.
        </p>
      </div>
    </main>
  );
}
