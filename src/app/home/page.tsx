import Image from "next/image";

export default function Login() {
    return (
        <main className="bg-[#0000FA] min-h-screen w-full
            flex flex-col items-center justify-center p-2 overflow-hidden ">
            {/*홈 로고_로고+텍스트 묶음*/}
            <div className="flex flex-col mt-[10vw] w-full max-w-[500px]">
                <div className="relative w-[85vw] max-w-[800px] aspect-square mb-2">
                    <Image src="/home.png" alt="홈화면로고"
                        fill className="object-contain" />
                </div>    

            {/*여기부터 다시--글자 위치 조절해야함*/}    
                <div className="flex justify-center"> 
                    <div className="text-[20vw] font-bold relative w-full -mt-50 items-center leading-[1]">
                        <p className= "text-white w-full">Dutch</p>
                        <p className="text-white w-full ml-[21vw]">Trip</p>
                    </div> 
                </div>
            </div> 
            {/*버튼*/}
            <div className="flex flex-col gap-3.5">
                <button className="h-14 w-[60vw] bg-[#0048FF] flex items-center 
                    rounded-xl gap-2 shadow-2xl justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-[4vw] font-bold">가평 여행 DAY-1</span>
                </button>
                <button className="h-14 w-[60vw] bg-[#0048FF] flex items-center 
                    rounded-xl gap-2 shadow-2xl justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-[4vw] font-bold">새로운 여행 추가</span>
                </button>
                <button className="h-14 w-[60vw] bg-[#0048FF] flex items-center 
                    rounded-xl gap-2 shadow-2xl justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-[4vw] font-bold">여행 등록</span>
                </button>
                <button className="h-14 w-[60vw] bg-[#0048FF] flex items-center 
                    rounded-xl gap-2 shadow-2xl justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-[4vw] font-bold">마이페이지</span>
                </button>
            </div>
        </main>    
    );
}