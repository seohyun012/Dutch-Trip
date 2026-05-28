"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { ChevronLeft, Plane } from "lucide-react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";

export default function Mypage() {
  const router = useRouter();

  {/* [연동 될 데이터]_임시 기본 데이터*/}
  const [userData, setUserData] = useState({
    userId: null,
    nickname: "최서현",
    email: "",
    profileImage: "/seohyun.png",
    bankName: "",
    accountNumber: "",
  });

  { /* [수동 작성]_계좌 입력*/}
  const [account, setAccount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  //계좌 작성 형식 지정(하이픈 생성)
  const formatAccount = (value: string) => {
    const firstDigitIndex = value.search(/\d/); 
    if (firstDigitIndex === -1) return value; 

    //은행명과 계좌번호 분리
    const prefix = value.slice(0, firstDigitIndex); //은행
    const onlyNums = value.slice(firstDigitIndex).replace(/[^\d]/g, ""); //계좌번호

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
    setAccount(formatAccount(e.target.value)); //포멧값으로 계좌값을 바꾸는함수
  };

  // 저장 시 양식 검사
  const handleSaveAccount = async () => {
    const regex = /.*\d{3}-\d{3}-\d{6}$/;
    
    if (regex.test(account)) {
      try {
        const token = localStorage.getItem("access_token");

        const parts = account.trim().split(" ");
        const bankName = parts[0];
        const accountNumber = parts[1];

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me/bank-info`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bank_name: bankName,         
            account_number: accountNumber 
          }),
        });

        if (res.ok) {
          setIsEditing(false);
          alert("계좌 정보가 성공적으로 업데이트되었습니다");
        } else {
          alert("계좌 저장에 실패했습니다. 다시 시도해 주세요.");
        }
      } catch (error) {
        console.error("계좌 정보 저장 중 통신 에러:", error);
        alert("서버 연결에 실패했습니다.");
      }
    } else {
      alert("계좌번호 양식이 올바르지 않습니다.\n예시: 신한은행 123-456-123456");
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
    // 백엔드에서 프로필 및 계좌 정보 가져오는 함수
   const fetchUserProfile = async () => {
      console.log("1. fetchUserProfile 함수 시작");
      try {
        const token = localStorage.getItem("access_token");
        console.log("2.토큰 확인:", token);

        if (!token) {
        console.error(" 로컬스토리지에 access_token이 없습니다. 다시 로그인 해주세요");
          setUserData({
            userId: null, email: "", nickname: "토큰 없음 (로그인 필요)",
            profileImage: "", bankName: "", accountNumber: "",
          });

        return;
      }
        console.log("3. 백엔드로 요청 보내기");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("4. 백엔드 응답 상태코드:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("5. 돌려준 실제 유저 데이터:", data);
          
          setUserData({
            userId: data.user_id,
            email: data.email,
            nickname: data.nickname, 
            profileImage: "/seohyun.png",
            bankName: data.bank_name,
            accountNumber: data.account_number,
          });

          //  등록된 계좌가 있다면 "은행명 계좌번호" 형식으로 인풋창에 저장
          if (data.bank_name && data.account_number) {
            setAccount(`${data.bank_name} ${data.account_number}`);
          }
        }
      } catch (error) {
        console.error("마이페이지 정보 로딩 실패:", error);
      }
    };

    // (2) 서버에서 여행 리스트 가져오기 (시뮬레이션)
    const fetchTravels = async () => {
      try {
        // 실제 연동 시: const res = await fetch('/api/travels');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/trips`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const resData = await res.json();
        
          if (resData.data && resData.data.length > 0) {
            const formattedData = resData.data.map((trip: any) => {
              const parts = (trip.start_date || "").split("-");
              const dateForm = parts.length >= 3 ? `${parts[2]}/${parts[1]}` : "00/00";
              return {
                trip_id: trip.trip_id,
                title: trip.title,
                start_data: trip.start_data,
                date: dateForm
              };
            });
            setTravels(formattedData);
          } else {
            // 백엔드가 비어있으면 더미 데이터 뜨게함
            setTravels([
            { trip_id: 10, title: "필리핀여행", start_date: "2026-05-24", date: "24/05" },
            { trip_id: 11, title: "커플여행", start_date: "2026-07-25", date: "25/07" }
            ]);
          }
        } else {
          setTravels([
            { trip_id: 10, title: "필리핀여행", start_date: "2026-05-24", date: "24/05" },
            { trip_id: 11, title: "커플여행", start_date: "2026-07-25", date: "25/07" }
          ]);
        }
      } catch (error) {
        setTravels([
            { trip_id: 10, title: "필리핀여행", start_date: "2026-05-24", date: "24/05" },
            { trip_id: 11, title: "커플여행", start_date: "2026-07-25", date: "25/07" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("access_token");
    fetchUserProfile();
    fetchTravels(); 
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
              localStorage.removeItem("access_token");
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
                  className="text-xl text-black bg-transparent outline-none w-full"
                />
              ) : (
                <span
                  className={`text-xl font-bold tracking-tight ${
                    (userData.bankName && userData.accountNumber) || account 
                      ? "text-black" 
                      : "text-black/30"
                  }`}
                  >
                  
                {userData.bankName && userData.accountNumber
                  ? `${userData.bankName} ${userData.accountNumber}`
                  : account || "계좌번호를 입력해주세요"}
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
                  key={travel.trip_id}
                  onClick={() => router.push(`/timeline/${travel.trip_id}?title=${encodeURIComponent(travel.title)}`)} // 👈 이름 데이터까지 같이 토스!
                  className="w-full bg-[#E5E5FE] rounded-2xl flex items-center p-2 gap-2 active:scale-[0.98] transition-all"
                >
                 
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
