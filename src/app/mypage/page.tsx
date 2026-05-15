"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { ChevronLeft, Plane } from "lucide-react";


export default function Mypage() {
    const router = useRouter();
    
    {/* [연동 될 데이터]_임시 기본 데이터*/ }
    const [userData, setUserData] = useState({
        nickname: "박지영",
        profileImage: "/profile.png"
    });

    {/* [수동 작성]_계좌 입력*/ }
    const [account, setAccount] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    //계좌 작성 형식 지정(하이픈 생성)
    const formatAccount = (value: string) => {
        const firstDigitIndex = value.search(/\d/);
        if (firstDigitIndex === -1) return value;

        //은행명과 계좌번호 분리
        const prefix = value.slice(0, firstDigitIndex);
        const onlyNums = value.slice(firstDigitIndex).replace(/[^\d]/g, "");
        
      let formattedNums = "";
        if (onlyNums.length <= 3) {
            formattedNums = onlyNums;
        } else if (onlyNums.length <= 6) {
            formattedNums = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        } else {
            formattedNums = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 12)}`;
        }
        return `${prefix}${formattedNums}`;
    };

    // 입력창 핸들러
    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(formatAccount(e.target.value));
    };

    // 저장 시 양식 검사
    const handleSaveAccount = () => {
        const regex = /.*\d{3}-\d{3}-\d{6}$/; 
        if (regex.test(account)) {
        setIsEditing(false);
        } else {
        alert("계좌번호 양식이 올바르지 않습니다.");
        }
    };

    {/* 서버에서 여행 기록 받아오기_여행명과 타임라인*/ }
    const [travels, setTravels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    {/*로그인 로직_카카오 로그인 정보 가져오기*/}
    useEffect(() => {
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
    fetchTravels();
  }, []);
    
    return (
        <main className="bg-white min-h-screen w-full flex flex-col relative items-stretch p-5 overflow-hidden justify-between">
            <div className="w-full flex flex-col gap-1">

            {/* 상단 뒤로가기 버튼 */}
            <header className="mb-[0.5vh] ">
                <button
                onClick={() => router.back()}
                className="-ml-2 p-1">
                    <ChevronLeft size={24} className="text-black"/>
                </button>
            </header>    

            {/*프로필 정보 박스*/}   
            <section className="bg-[#E5E5FE] rounded-[25px] p-5 h-[11vh] w-full flex items-center justify-between mb-1 shadow-sm aspect-square">
                    <div className="flex items-center gap-4">
                        <div className="w-[15vw] h-[15vw] bg-white max-w-[70px] max-h-[70px] rounded-full overflow-hidden border-2 border-white">
                            <Image 
                            src={userData.profileImage} 
                            alt="프로필" 
                            width={64} 
                            height={64} 
                            className="object-cover w-full h-full" 
                            />
                        </div>
                        <span className="text-[20px] font-black text-black">{userData.nickname}</span>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("kakao_user");
                            router.push("/login");
                        }}
                        className="bg-white px-4 py-2 rounded-full text-sm font-bold text-black shadow-sm
                    active:scale-95 transition-transform">
                    로그아웃
                    </button>
                </section>    
                
                {/*계좌번호 입력_수동입력 및 수정*/} 
                <section className="flex items-center justify-between px-2 mb-[10vh]">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={account}
                                onChange={handleAccountChange} 
                                placeholder="한국은행 123-456-123456"
                                maxLength={25}
                                autoFocus
                                className="text-[14px] font-bold text-black border-b-2 border-[#0000FA] bg-transparent outline-none w-full"></input>
                        ) : (
                                <span className={`text-[14px] font-bold tracking-tight ${account ? 'text-black' : 'text-black/30'}`}>
                                    {account || "계좌번호를 입력해주세요"}
                                </span>
                        )}
                    </div>
                    <button 
                        onClick={isEditing ? handleSaveAccount : () => setIsEditing(true)} 
                        className="text-[14px] font-bold text-black/40 ml-4 shrink-0"
                    >
                        {isEditing ? "저장" : "수정"}
                    </button>
                </section>

                {/*여행 기록 리스트*/}
                <section className="flex flex-col gap-4 z-10">
                    <h2 className="text-xl font-black text-black ">내 여행</h2>
                    <div className="flex flex-col gap-2">
                        {loading ? (
                        <   div className="animate-pulse bg-[#E5E5FE] h-14 rounded-2xl w-full" />
                        ) : travels.length > 0 ? (
                        travels.map((travel) => (
                            <button 
                                key={travel.id} 
                                onClick={() => router.push(`/timeline/${travel.id}`)}
                                className="w-full bg-[#E5E5FE] h-13 rounded-2xl flex items-center px-5 gap-3 active:scale-[0.98] transition-all hover:bg-[#D5D5FE]"
                            >
                                <Plane size={22} className="text-black" />
                                <span className="text-x font-black text-black">
                                    {travel.date} {travel.title}
                                </span>
                            </button>
                        ))
                        ) : (
                        <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">아직 여행 기록이 없어요!</p>
                        </div>
                        )}
                    </div>
                </section>

                {/*배경 로고*/}
                <div className="absolute bottom-[-7vh] -right-16 opacity-25 -z-0 pointer-events-none"> 
                    <Image src="/mypage.png" alt="배경 로고" width={320} height={320} className= "w-[82vw] max-w-[350px]"></Image>
                </div>       
            </div>

            {/*송금 버튼*/}
            <footer className="fixed bottom-6 left-0 w-full px-6 z-20">
                <button
                    onClick={() => router.push("/pay")}
                    className="w-full h-16 bg-[#E5E5FE] rounded-[20px] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <span className="text-xl font-bold text-black">송금으로 이동</span>
                </button>
            </footer>
        </main>
    );
}