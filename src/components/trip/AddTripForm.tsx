"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { FixedExpense } from "@/store/useTripStore";
import type { TripRequest, TripResponse } from "@/types";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";

/*function generateInviteCode() {
  //랜덤코드 만드는 함수. api받으면 이거지우고 그걸로 사용
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}*/

interface Props {
  onSubmit: (trip: TripRequest) => Promise<TripResponse>;
  isPending?: boolean;
}

export default function AddTripForm({ onSubmit, isPending = false }: Props) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tripId, setTripId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { item_name: "", price: 0 },
  ]); //fixedExpenses: 현재 고정비용목록, useState<FixedExpense[]>: FixedExpense타입배열로 관리한다.

  function handleFixedExpenseChange(
    idx: number,
    field: "item_name" | "price",
    value: string, //이것들이 매개변수 그니까 수정할 것들
  ) {
    setFixedExpenses((prev) =>
      prev.map(
        (item, i) =>
          i === idx //수정할 항목 찾음
            ? { ...item, [field]: field === "price" ? Number(value) : value }
            : item, //수정할거만 수정하고 나머지는 다시 반환
      ),
    );
  }

  function handleAddFixedExpense() {
    setFixedExpenses((prev) => [...prev, { item_name: "", price: 0 }]); //고정비용 입력칸 추가
  }

  async function handleSubmit() {
    if (!title.trim() || !startDate || !endDate) return; //뭐가 하나라도 없으면 그냥 종료

    //const code = generateInviteCode();
    //const id = Date.now(); //이렇게 현재시간으로 아이디 넣은거 api연동하면 다 교체해야함

    const newTrip: TripRequest = {
      //trip_id: id,
      title: title.trim(),
      //invite_code: code,
      nation: "대한민국",
      start_date: startDate,
      end_date: endDate,
      fixed_costs: fixedExpenses
      .filter((e) => e.item_name.trim())  // 빈칸은 제외
      .map((e) => ({
        title: e.item_name.trim(),
        total_amount: e.price,
      })),
    };

    /*onSubmit(newTrip); //이거때문에 add-trip/page.tsx의 핸들섭밋실행
    setInviteCode(code); //초대코드설정
    setTripId(id);
    setShowModal(true);*/

    try {
      const response = await onSubmit(newTrip); //서버에서 trip_id, invite_code를 받아옴
      setInviteCode(response.invite_code); //서버가 만든 진짜 초대코드 설정
      setTripId(response.trip_id); //서버가 만든 진짜 trip_id 설정
      setShowModal(true);
    } catch {
      alert("여행 생성에 실패했습니다.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="여행 추가" />

      <div className="flex flex-col gap-4 px-4 mt-4">
        {/* 여행 이름 */}
        <input //키보드 타이핑을 받기 위해 input사용
          value={title} // 현재 title state 값을 보여줌
          onChange={(e) => setTitle(e.target.value)} //타이핑 할때마다 title바꿔줌
          placeholder="여행 이름 입력"
          className="w-full py-7 font-bold text-center text-2xl bg-[#E5E5FE] rounded-xl placeholder-gray-400 outline-none"
        />

        {/* 여행 시작일 */}
        <div className="w-full flex items-center justify-between py-5 px-5 text-2xl font-bold bg-[#E5E5FE] rounded-xl">
          <span>여행 시작일</span>
          <input
            type="date" //캘린더 열기
            value={startDate} //선택된 날짜 표시
            onChange={(e) => setStartDate(e.target.value)} //날짜 선택하면 변경
            className="bg-transparent text-2xl font-bold outline-none text-right" //bg-transparent:배경투명
          />
        </div>

        {/* 여행 마지막일 */}
        <div className="w-full flex items-center justify-between py-5 px-5 text-2xl font-bold bg-[#E5E5FE] rounded-xl">
          <span>여행 마지막일</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-2xl font-bold outline-none text-right"
          />
        </div>

        {/* 고정비용 */}
        <div className="bg-[#E5E5FE] rounded-xl p-4">
          <p className="text-2xl font-bold text-black mb-1">고정비용 추가</p>

          {fixedExpenses.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-xl text-black py-1"
            >
              <input
                value={item.item_name} //현재항목이름표시(내가 쓴거)
                onChange={
                  (e) =>
                    handleFixedExpenseChange(idx, "item_name", e.target.value) //입력할때마다 몇번째항목, 어떤이름으로 바귀는지 저 함수 실행
                }
                placeholder="항목 입력"
                className="bg-transparent w-1/2 outline-none placeholder-gray-400"
              />
              <input
                value={item.price || ""} // 0이면 빈칸
                onChange={(e) =>
                  handleFixedExpenseChange(idx, "price", e.target.value)
                }
                type="number"
                placeholder="금액 입력"
                className="bg-transparent w-1/3 text-right outline-none placeholder-gray-400"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddFixedExpense}
          className="w-full py-4 bg-[#E5E5FE] rounded-xl flex items-center justify-center"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {/*fixed inset-0: 화면 전체를 덮음, bg-black/50: 그때 배경을 반투명블랙*/}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6">
            <p className="text-2xl font-bold">초대 코드</p>
            <p className="text-4xl font-bold text-[#0C6DFF]">{inviteCode}</p>
            <button
              onClick={() => router.push(`/trip/${tripId}?tab=일정`)}
              className="w-full py-3 rounded-2xl bg-[#0C6DFF] text-white text-2xl font-bold active:scale-[0.98] transition-all"
            >
              입장하기
            </button>
          </div>
        </div>
      )}

      <Button
        label="여행 만들기"
        onClick={handleSubmit}
        disabled={!title.trim() || !startDate || !endDate}
        fixed
      />
    </div>
  );
}
