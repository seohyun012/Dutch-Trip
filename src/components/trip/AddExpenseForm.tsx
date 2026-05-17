"use client";

import { useRef, useState } from "react";
// <input type="file" />은 못생겨서 숨겨두고, 버튼 클릭하면 useRef로 숨겨진 input을 코드로 클릭하는 방식
import { useRouter } from "next/navigation";
import type { Expense, ExpenseItem, Participant } from "@/types";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";

// ── 더미 OCR 데이터 (나중에 실제 API 응답으로 교체) ──
const DUMMY_OCR: Pick<
  Expense,
  "title" | "total_amount" | "items" | "payment_time"
> = {
  //이 세개만 골라서 사용하겠다.
  title: "대성리 피자",
  total_amount: 45000,
  payment_time: "2026-05-01T12:00:00",
  items: [
    { item_name: "알리올리오 파스타", price: 10000, participants: [] },
    { item_name: "투움바 파스타", price: 15000, participants: [] },
    { item_name: "마르게리따 피자", price: 18000, participants: [] },
    { item_name: "콜라 500ml", price: 2000, participants: [] }, //참여자 빈 상태로
  ],
};

interface Props {
  tripId: number;
  members: Participant[]; // 여행멤버 타입을 설정해준거
  onSubmit: (expense: Expense) => void; // 이대로 반영하기 눌렀을 때
}

export default function AddExpenseForm({ tripId, members, onSubmit }: Props) {
  const router = useRouter(); //페이지 이동을 위한 훅
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 첨부 여부
  const [imageAttached, setImageAttached] = useState(false);

  // OCR로 채워지는 데이터 (지금은 더미)
  const [title, setTitle] = useState("");
  //title: 제목 저장 변수, setTitle: title을 변경하는 함수(함수실행에서 인수를 넣어주면 그걸로)
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentTime, setPaymentTime] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<ExpenseItem[]>([]);
  //ExpenseItem타입 배열로 items를 주겠다.

  // 유저가 선택하는 값
  const [splitType, setSplitType] = useState<"개인" | "더치">("더치");
  const [payerUserId, setPayerUserId] = useState<number | null>(null);

  // 영수증 사진 추가 클릭 → 파일 선택창 열기
  function handleImageClick() {
    fileInputRef.current?.click(); //못생긴 인풋대신 내 버튼 눌러도 인풋 적용되게
  }

  // 파일 선택 시 → 더미 OCR 데이터로 채우기 (나중에 실제 API 연동)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    //e: React.ChangeEvent<HTMLInputElement>: 인풋 변화생기면 넘어옴
    if (!e.target.files?.length) return; //파일 선택안하면 종료
    setImageAttached(true);
    setTitle(DUMMY_OCR.title);
    setTotalAmount(DUMMY_OCR.total_amount);
    setPaymentTime(DUMMY_OCR.payment_time ?? "");
    setItems(DUMMY_OCR.items);
  }

  // 이대로 반영하기
  function handleSubmit() {
    if (!payerUserId) return; //결제자 선택 안했으면 종료
    const payer = members.find((m) => m.user_id === payerUserId); //id로 id랑 닉네임 불러오기
    if (!payer) return;

    const newExpense: Expense = {
      expense_id: Date.now(), // 임시 id (실제 연동 시 서버에서 받음)
      title, //title:title, 이랑 같은거임.
      total_amount: totalAmount,
      expense_type: "추가금액",
      split_type: splitType,
      payment_time: paymentTime,
      payer, //이미 위에서 찾았으니까 그거쓰면됨.
      item_count: items.length,
      items,
    };

    onSubmit(newExpense); //add-expense-page에서 handleSubmit실행->newExpense를 새 영수증(store)에 추가
    router.push(`/trip/${tripId}?tab=영수증`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white ">
      {/*min-h-screen: 내용이 적어도 화면 전체를 채우고, 내용이 많으면 그 이상으로 늘어남.*/}
      <Header title="가평 여행" />
      {/* 영수증 사진 추가 버튼 */}
      <button
        onClick={handleImageClick}
        className="py-6 text-2xl font-bold bg-[#E5E5FE] text-black rounded-xl mt-4 mx-4"
      >
        영수증 사진 추가
      </button>
      {/* 실제 파일 input (숨김) — accept로 폰/컴 둘 다 이미지 선택 가능 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 사진 첨부 후: OCR 결과 + 입력폼 */}
      {/*전체네모박스*/}
      {imageAttached && ( //여러개의 요소가 있을때는 전체를 감싸는 div, <>이런거 필요
        <div className="rounded-xl p-4 mx-4 mt-5 bg-[#E5E5FE]">
          <div className="flex justify-between items-center">
            {/*justify-between: 자식을 양끝으로*/}
            <p className="text-xl font-normal text-[#0C6DFF]">{title}</p>
            <p className="text-xl text-[#0C6DFF]">
              {totalAmount.toLocaleString()}원
            </p>
          </div>
          <hr className="border-dashed border-black my-2" />
          {/* 메뉴 목록 */}
          <div className="pb-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-lg text-black py-0.5"
              >
                <span>{item.item_name}</span>
                <span>{item.price.toLocaleString()}원</span>
              </div>
            ))}
            <hr className="border-dashed border-black my-2" />
          </div>
          <p className="text-xl text-[#0C6DFF] mb-3">
            {paymentTime &&
              new Date(paymentTime).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>
          <img src="/barcode.png" alt="barcode" className="w-full" />
        </div>
      )}

      {/* 결제자 선택 */}
      {imageAttached && (
        <div className="m-4 bg-[#E5E5FE] rounded-xl p-4">
          <p className="text-xl text-black mb-2">결제자 선택</p>
          <div className="flex gap-2 flex-wrap">
            {/*flex-wrap:줄바꿈 허용*/}
            {members.map((m) => (
              <button
                key={m.user_id}
                onClick={() => setPayerUserId(m.user_id)}
                className="px-4 py-1 text-xl rounded-lg"
                style={{
                  backgroundColor:
                    payerUserId === m.user_id ? "#85B5FF" : "#ffffff",
                  color: "#000000",
                }}
              >
                {m.nickname}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* 개인메뉴 / 더치페이 선택 */}
      {imageAttached && (
        <div className="flex gap-4 mt-3 px-4">
          <button
            onClick={() => setSplitType("개인")}
            className="flex-1 py-4 text-2xl text-black rounded-2xl"
            style={{
              backgroundColor: splitType === "개인" ? "#0C6DFF" : "#E5E5FE",
              color: "black",
            }}
          >
            개인 메뉴
          </button>
          <button
            onClick={() => setSplitType("더치")}
            className="flex-1 py-4 text-2xl text-black rounded-2xl"
            style={{
              backgroundColor: splitType === "더치" ? "#0C6DFF" : "#E5E5FE",
              color: "black",
            }}
          >
            더치페이
          </button>
        </div>
      )}

      {/* 이대로 반영하기 버튼 — 사진 첨부 후에만 활성화 */}
      <Button
        label="이대로 반영하기"
        onClick={handleSubmit}
        disabled={!imageAttached}
        fixed
      />
    </div>
  );
}
