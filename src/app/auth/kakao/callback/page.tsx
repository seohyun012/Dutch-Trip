"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    //카카오 인가 코드 받아오기
    const kakaoCode = searchParams.get("code");

    if (kakaoCode) {
      const handleLoginFlow = async () => {
        try {
          //토큰 요청
          const kakaoTokenResponse = await fetch(
            "https://kauth.kakao.com/oauth/token",
            {
              method: "POST",
              headers: {
                "Content-type":
                  "application/x-www-form-urlencoded;charset=utf-8",
              },
              body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || "",
                redirect_uri: "http://localhost:3000/auth/kakao/callback",
                code: kakaoCode,
              }),
            },
          );

          const kakaoTokenData = await kakaoTokenResponse.json();
          //발급받은 유저의 토큰
          const realKakaoAccessToken = kakaoTokenData.access_token;

          if (!realKakaoAccessToken) {
            console.error(
              "환경변수에서 테스트 토큰을 읽어오지 못했습니다. .env.local을 확인해주세요!",
            );
            return;
          }
          //카카오가 준 토큰을 백엔드 서버에 전달
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${realKakaoAccessToken}`,
              },
              body: JSON.stringify({
                kakao_access_token: realKakaoAccessToken,
              }),
            },
          );
          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("access_token", data.access_token);
            setAuth(data.user_id, data.nickname);
            router.push("/home");
          } else {
            console.error("백엔드 서버 로그인 실패:", data);
          }
        } catch (error) {
          console.error("로그인 처리 중 통신 오류 발생:", error);
        }
      };
      handleLoginFlow();
    }
  }, [searchParams, router]);

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
