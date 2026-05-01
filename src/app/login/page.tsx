import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Login() {
    return (
        <main className="bg-[#0000FA] min-h-screen w-full">
            {/*로그인 로고*/}
            <div className="mb-10">
                <Image src="/login.png" alt="로그인로고"
                    width={500} height={500} />
            </div>   
            {/*카카오 버튼*/}
                <button className="h-14 bg-[#FEE500] flex items-center justify-center">
                    <MessageCircle className="size-10 scale-x-[-1] fill-black">
                    </MessageCircle>
                    카카오 로그인
                </button>
        </main>    
    );
}