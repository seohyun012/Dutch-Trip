"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Login() {
  const REST_API_KEY = "4854a23fc38bfa5994757158caf67d95";
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao";
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <main className="bg-[#0000FA] min-h-screen w-full flex flex-col items-center justify-center gap-5 overflow-hidden pb-20">
      {/* 로고 영역: 중앙 배치 유도 */}
      <div className=" flex items-center justify-center w-full">
        <motion.div //에니메이션을 위해  framer-motion 오픈소스
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Image
            src="/login.png"
            alt="로그인로고"
            width={500}
            height={500} //정사각형이라는 배율만 알려줌
            className="w-[85vw] min-w-[180px] max-w-[400px] h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* 로그인 버튼 영역: 하단 고정 */}
      <div className="w-full px-16">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="h-16 w-full bg-[#FEE500] flex items-center justify-center rounded-2xl gap-2 
                     shadow-xl active:brightness-90 transition-all"
        >
          <MessageCircle
            size={24}
            className="fill-black stroke-0 scale-x-[-1]"
          />
          {/*scale-x-[-1]:좌우반전 */}
          <span className="text-black text-2xl font-bold">카카오 로그인</span>
        </motion.button>
      </div>
    </main>
  );
}
