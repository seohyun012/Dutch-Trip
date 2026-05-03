import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Login() {
    return (
        <main className="bg-[#0000FA] min-h-screen w-full
            flex flex-col items-center justify-center p-2 overflow-hidden ">
            {/*로그인 로고*/}
            <div className="relative w-full -mt-40 -mb-6.5 flex justify-center
                 scale-[1.5] -translate-x-[10%]">
                <Image src="/login.png" alt="로그인로고"
                    width={1500} height={1500} 
                    className="w-full h-auto" />
            </div>   
            {/*카카오 버튼*/}
            <button className="h-14 w-[60vw] bg-[#FEE500] flex items-center relative z-50
                rounded-xl gap-2 shadow-2xl justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]
                translation-all duration-120 hover:brightness-105 active:scale-98 active:brightness-90">
                <MessageCircle className="w-[6.5vw] h-[6.5vw] max-w-[28px] max-h-[28px]
                    scale-x-[-1] fill-black stroke-0">
                </MessageCircle>
                    <span className="text-black text-[4.7vw] font-bold">카카오 로그인</span>
            </button>
        </main>    
    );
}