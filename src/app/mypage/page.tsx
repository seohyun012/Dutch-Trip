"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, Plus, Triangle } from "lucide-react";


export default function Mypage() {
    const router = useRouter();
    
    {/*임시 기본 데이터*/}
    const [userData, setUserData] = useState({
    nickname: "로딩 중...",
    profileImage: "/default-profile.png"
    });

    {/*로그인 로직*/}
    useEffect(() => {
    // 예: const user = await getKakaoUserInfo();
    setUserData({
      nickname: "박지영", 
      profileImage: "/profile.png"
    });
  }, []);
    
    return (
        <main className="bg-white min-h-screen w-full flex flex-col relative items-stretch p-5 overflow-hidden">
            <div className="w-full flex flex-col gap-1">

            {/* 상단 뒤로가기 버튼 */}
            <header className="mb-1 ">
                <button
                onClick={() => router.back()}
                className="-ml-2 p-1">
                    <ChevronLeft size={24} className="text-black"/>
                </button>
            </header>    

            {/*프로필 정보 박스*/}   
            <section className="bg-[#E5E5FE] rounded-[25px] p-5 h-[12vh] w-full flex items-center justify-between mb-1 shadow-sm aspect-square">
                    <div className="flex items-center gap-4">
                        <div className="w-15 h-15 bg-white rounded-full overflow-hidden border-2 border-white">
                            <Image 
                            src={userData.profileImage} 
                            alt="프로필" 
                            width={64} 
                            height={64} 
                            className="object-cover w-full h-full" 
                            />
                        </div>
                        <span className="text-xl font-black text-black">{userData.nickname}</span>
                    </div>
                    <button className="bg-white px-4 py-2 rounded-full text-sm font-bold text-black shadow-sm
                    active:scale-95 transition-transform">
                    로그아웃
                    </button>
            </section>    
            </div>
        </main>
    );
}