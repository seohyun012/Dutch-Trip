"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { ChevronLeft, Plane } from "lucide-react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";

export default function Mypage() {
  const router = useRouter();

  {
    /* [연동 될 데이터]_임시 기본 데이터*/
  }
  const [userData, setUserData] = useState({
    nickname: "최서현",
    profileImage: "/seohyun.png",
  });

  {
    /* [수동 작성]_계좌 입력*/
  }
  const [account, setAccount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  //계좌 작성 형식 지정(하이픈 생성)
  const formatAccount = (value: string) => {
    const firstDigitIndex = value.search(/\d/); //숫자인덱스를 찾음.
    if (firstDigitIndex === -1) return value; //숫자가 없으면 기본값 반환

    //은행명과 계좌번호 분리
    const prefix = value.slice(0, firstDigitIndex); //은행
    const onlyNums = value.slice(firstDigitIndex).replace(/[^\d]/g, ""); //계좌번호
    // ^는 "아닌", \d는 숫자, g는 전체에서 찾기

    let formattedNums = "";
    if (onlyNums.length <= 3) {
      formattedNums = onlyNums;
    } else if (onlyNums.length <= 6) {
      formattedNums = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`; //onlyNums.slice(3): 인덱스3부터 끝까지
    } else {
      formattedNums = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 12)}`;
    }
    return `${prefix}${formattedNums}`;
  };

  // 입력창 핸들러
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //입력할 때마다 이걸 실행
    setAccount(formatAccount(e.target.value)); //포멧값으로 계좌값을 바꾸는함수
  };

  // 저장 시 양식 검사
  const handleSaveAccount = () => {
    const regex = /.*\d{3}-\d{3}-\d{6}$/;
    if (regex.test(account)) {
      //acount가 regex를 만족하는지 test해보는 것
      setIsEditing(false);
    } else {
      alert("계좌번호 양식이 올바르지 않습니다.");
    }
  };

  {
    /*서버에서 여행 기록 받아오기_여행명과 타임라인*/
  }
  const [travels, setTravels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); //데이터를 불러오는 중인지 아닌지

  {
    /*로그인 로직_카카오 로그인 정보 가져오기*/
  }
  useEffect(() => {
    //페이디 처음 렌더링될때
    const savedUser = localStorage.getItem("kakao_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserData({
        nickname: parsedUser.nickname || "박지영",
        profileImage: (parsedUser.profile_image || "/profile.png").trim(),
      });
    }
    //}, []);

    // (2) 서버에서 여행 리스트 가져오기 (시뮬레이션)
    const fetchTravels = async () => {
      try {
        // 실제 연동 시: const res = await fetch('/api/travels');
        const dataFromServer = [
          { id: "trip_01", date: "24/05", title: "필리핀여행" }, //임시 데이터
          { id: "trip_02", date: "25/07", title: "커플여행" },
        ];
        setTravels(dataFromServer);
      } finally {
        setLoading(false);
      }
    };
    fetchTravels(); //async 함수는 useEffect 안에서 직접 쓸 수 없어서, 안에서 정의하고 바로 호출하는 방식
  }, []);

  return (
    <main className="bg-white min-h-screen w-full flex flex-col relative overflow-hidden">
      <Header title="마이페이지" />
      <div className="w-full flex flex-col gap-1 px-4">
        {/*프로필 정보 박스*/}
        <section className="bg-[#E5E5FE] rounded-2xl mt-4 px-5 py-3 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
              <Image
                src={userData.profileImage}
                alt="프로필"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-2xl font-black text-black">
              {userData.nickname}
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("kakao_user");
              router.push("/login");
            }}
            className="bg-white px-4 py-2 rounded-full text-xl font-normal text-black active:scale-95 transition-transform"
          >
            로그아웃
          </button>
        </section>

        {/*계좌번호 입력_수동입력 및 수정*/}
        <section className="flex items-center justify-between px-2 mb-25">
          <div className="flex-1 pt-1">
            {isEditing ? (
              <input
                type="text"
                value={account}
                onChange={handleAccountChange}
                placeholder="한국은행 123-456-123456"
                maxLength={25}
                //autoFocus 최서현: 굳이?
                className="text-xl text-black bg-transparent outline-none w-full"
              ></input>
            ) : (
              <span
                className={`text-xl font-bold tracking-tight ${account ? "text-black" : "text-black/30"}`}
              >
                {account || "계좌번호를 입력해주세요"}
              </span>
            )}
          </div>
          <button
            onClick={isEditing ? handleSaveAccount : () => setIsEditing(true)}
            className="text-xl text-black/40 shrink-0 pt-1"
          >
            {isEditing ? "저장" : "수정"}
          </button>
        </section>

        {/*여행 기록 리스트*/}
        <section className="flex flex-col gap-4 z-10">
          <h2 className="text-2xl text-black px-2">내 여행</h2>
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="animate-pulse bg-[#E5E5FE] rounded-2xl w-full" />
            ) : travels.length > 0 ? (
              travels.map((travel) => (
                <button
                  key={travel.id}
                  onClick={() => router.push(`/timeline/${travel.id}`)}
                  className="w-full bg-[#E5E5FE] rounded-2xl flex items-center p-2 gap-2 active:scale-[0.98] transition-all"
                >
                  {/*active:scale-[0.98]: 버튼 누르는 순간 98% 크기, transition-all: 모든 변화를 부드럽게 애니메이션 */}
                  <Plane size={32} className="text-black" />
                  <span className="text-2xl text-black">
                    {travel.date} {travel.title}
                  </span>
                </button>
              ))
            ) : (
              <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">
                  아직 여행 기록이 없어요
                </p>
              </div>
            )}
          </div>
        </section>

        {/*배경 로고*/}
        <div className="absolute bottom-[3vh] -right-12 opacity-25 -z-0 pointer-events-none">
          <Image
            src="/mypage.png"
            alt="배경 로고"
            width={320}
            height={320}
            className="w-[82vw] max-w-[350px]"
          ></Image>
        </div>
      </div>

      <Button label="송금으로 이동" onClick={() => router.push("/pay")} fixed />
    </main>
  );
}
