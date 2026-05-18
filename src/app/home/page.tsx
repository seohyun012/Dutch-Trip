"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  //입력창 모드 관리
  const [isInputMode, setIsInputMode] = useState(false); //"여행 참여" 버튼을 눌렀을 때 버튼 대신 입력창을 보여줄지 말지를 결정
  const [tripCode, setTripCode] = useState(""); //입력창에 사용자가 타이핑한 6자리 코드 값을 실시간으로 저장
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
      if (val === VALID_CODE) {
        setTimeout(() => alert("여행에 참여합니다"), 100);
        //router.push("");
      } else {
        setTimeout(() => {
          alert("등록 된 여행이 없습니다.");
          setTripCode("");
        }, 100);
      }
    }
  };

  return (
    <main className="bg-[#0000FA] min-h-screen w-full flex flex-col justify-center items-center p-5 overflow-hidden pt-25">
      {/*overflow-hidden: 홈배경 빠져나오지않게*/}
      {/* 상단 로고 및 텍스트 영역 */}
      <section className="flex flex-col items-center w-full mb-12">
        {/*로고와 텍스트 위치*/}
        <div className="relative flex flex-col w-fit">
          {/*relative: 자식 중에 absolute로 배치된 이미지의 기준점, w-fit: 자식내용물 크기만큼 너비가짐*/}
          <motion.div
            initial={{ opacity: 0, y: 20 }} //framer-motion오픈소스
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-[75%] -left-[45%] z-0 w-[75vw] min-w-[250px] max-w-[400px] aspect-square pointer-events-none"
          >
            <Image
              src="/home.png"
              alt="홈화면로고"
              fill //부모크기에 맞게
              className="object-contain" // 비율 유지, 이미지 전체 보임
              priority //제일먼저 이미지불러옴
            />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-[280px] pt-10">
            <h1
              style={{ fontFamily: "RiaSans" }}
              className="text-[min(22vw,140px)] text-white leading-[0.8] tracking-tighter p-2 drop-shadow-[8px_12px_0px_rgba(0,0,145,0.9)]"
            >
              Dutch
            </h1>
            <h1
              style={{ fontFamily: "RiaSans" }}
              className="text-[min(22vw,140px)] text-white leading-[0.8] ml-30 tracking-tighter mt-6 drop-shadow-[8px_12px_0px_rgba(0,0,145,0.9)]"
            >
              {/*leading-[0.8]:줄간격 tracking-tighter:글자사이간격 */}
              Trip
            </h1>
          </div>
        </div>
      </section>

      {/* 하단 버튼 메뉴 영역 */}
      <section className="flex flex-col gap-3 w-full px-9">
        {menus.map((menu, idx) => {
          {
            /*입력 모드일 때만 input을 보여줌*/
          }
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
                  className="h-16 w-full rounded-2xl border-2 border-white bg-white/20 text-center font-bold text-2xl text-white placeholder:text-white/60 focus:outline-none shadow-lg"
                />
                {/* 취소 버튼 */}
                <button
                  onClick={() => {
                    setIsInputMode(false);
                    setTripCode("");
                  }}
                  className="absolute right-4 top-4 text-lg text-white/70 underline"
                >
                  취소
                </button>
              </motion.div>
            );
          }

          {
            /*평상시(입력모드 아닐 때의 코드)*/
          }
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97, filter: "brightness(0.9)" }}
              onClick={() => {
                if (menu.title === "여행 참여") {
                  setIsInputMode(true);
                } else if (menu.title === "마이페이지") {
                  router.push("/mypage");
                } else if (menu.title === "새로운 여행 추가") {
                  router.push("/add-trip");
                } else if (menu.title === "가평 여행 DAY-1") {
                  router.push("/trip/1");
                }
              }}
              className={`h-16 w-full rounded-2xl font-bold text-2xl shadow-lg transition-all
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
