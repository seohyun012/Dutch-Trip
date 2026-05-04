"use client";

import { motion } from "framer-motion";

export default function KakaoCallback() {
  return (
    <main className="bg-[#0000FA] min-h-screen w-full flex flex-col items-center justify-center p-8">
      {/* 로그인 콜백 페이지*/}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"
      />
      <h2 className="text-white text-xl font-bold">카카오 로그인 처리 중...</h2>
      <p className="text-white/60 mt-2 text-center">
        카카오 서버에서 정보를 안전하게 가져오고 있습니다.
      </p>
    </main>
  );
}