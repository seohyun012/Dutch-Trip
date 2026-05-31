"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function Header({
  title,
  backTo,
}: {
  title: string;
  backTo?: string;
}) {
  const router = useRouter();

  return (
    <header className="relative flex items-center py-3 bg-[#0C6DFF] sticky top-0 z-20">
      {/*  flex: 한줄로보이게(가로정렬), 
        items-center: 그 한줄안에서 위아래 높이 맞춤,
        px-3: 좌우 패딩, py-3: 상하 패딩 
        sticky: 스크롤해도 해더고정,
        top-0: 최상단 고정,*/}
      <button
        onClick={() => (backTo ? router.push(backTo) : router.back())}
        className="absolute left-3 text-white"
      >
        <ChevronLeft size={34} strokeWidth={3} />
      </button>
      <h1 className="w-full text-center font-bold text-2xl text-white">
        {title}
      </h1>
    </header>
  );
}
