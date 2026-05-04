"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  //입력창 모드 관리
  const [isInputMode, setIsInputMode] = useState(false);
  const [tripCode, setTripCode] = useState("");
  //테스트용 코드
  const VALID_CODE = "1A3456";

  const menus = [
    { title: "가평 여행 DAY-1", primary: true },
    { title: "새로운 여행 추가", primary: false },
    { title: "여행 참여", primary: false },
    { title: "마이페이지", primary: false },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTripCode(val);

    if (val.length === 6) {
      // 코드 일치 시 타임라인으로
      if (val === VALID_CODE) {
        alert("여행에 참여합니다");
        //router.push("/timeline");
      } else {
        alert("등록 된 여행이 없습니다.");
        setTripCode("");
      }
    }  
  };

    return (
      <main className="bg-[#0000FA] min-h-screen w-full flex flex-col justify-center items-center p-5 overflow-hidden">
        {/* 상단 로고 및 텍스트 영역 */}
        <section className="flex flex-col items-center w-full mb-12">
          {/*로고와 텍스트 위치 설정을 위함*/}
          <div className="relative flex flex-col items-start w-fit max-w-[280px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-[71%] -left-[60%] z-0 w-[90vw] max-w-[800px] aspect-square pointer-events-none"
            >
              <Image
                src="/home.png"
                alt="홈화면로고"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-[280px] pt-10">
              <h1 className="text-[22vw] sm:text-8xl font-black text-white leading-[0.8] italic tracking-tighter p-2">
                Dutch
              </h1>
              <h1 className="text-[22vw] sm:text-8xl font-black text-white leading-[0.8] italic tracking-tighter ml-[15vw]">
                Trip
              </h1>
            </div>
          </div>
        </section>

        {/* 하단 버튼 메뉴 영역 */}
        <section className="flex flex-col gap-3 w-full max-w-[320px]">
          {menus.map((menu, idx) => {
          {/*입력 모드일 때만 input을 보여줌*/ }
          if (menu.title === "여행 참여" && isInputMode) {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-full"
              >
                <input
                  autoFocus
                  type="text"
                  maxLength={6}
                  placeholder="참여 코드 6자리 입력"
                  value={tripCode}
                  onChange={handleInputChange}
                  className="h-14 w-full rounded-2xl border-2 border-white bg-white/20 text-center font-bold text-white placeholder:text-white/60 focus:outline-none shadow-lg"
                />
                {/* 취소 버튼 */}
                <button 
                  onClick={() => { setIsInputMode(false); setTripCode(""); }}
                  className="absolute right-4 top-4 text-xs text-white/70 underline"
                >
                  취소
                </button>
              </motion.div>
            );
          }

          {/*평상시(입력모드 아닐 때의 코드)*/ }
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97, filter: "brightness(0.9)" }}
              onClick={() => {
                if (menu.title === "여행 참여") {
                  setIsInputMode(true);
                }
                else if (menu.title === "마이페이지") {
                  //router.push(./mypage);
                  alert("마이페이지로 이동합니다");
                }
                else if (menu.title === "새로운 여행 추가") {
                  //router.push(./);
                  alert("새로운 여행을 생성합니다");
                }
                else if (menu.title === "가평 여행 DAY-1") {
                  //router.push(./); -->아마 타임라인으로 이동
                  alert("현재 진행중인 여행으로 이동합니다");
                }
              }}
              className={`h-14 w-full rounded-2xl font-bold text-lg shadow-lg transition-all
              ${menu.primary ? "bg-[#0048FF] text-white" : "bg-white text-[#0000FA]"}
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`}
            >
              {menu.title}
            </motion.button>
          );
        })}
      </section>
    </main>
  );
}
