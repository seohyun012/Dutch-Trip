"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense, ExpenseItem, Participant } from "@/types";

// ── 더미 OCR 데이터 (나중에 실제 API 응답으로 교체) ──
const DUMMY_OCR: Pick<Expense, "title" | "total_amount" | "items"> = {
  title: "대성리 피자",
  total_amount: 45000,
  items: [
    { item_name: "알리올리오 파스타", price: 10000, participants: [] },
    { item_name: "투움바 파스타", price: 15000, participants: [] },
    { item_name: "마르게리따 피자", price: 18000, participants: [] },
    { item_name: "콜라 500ml", price: 2000, participants: [] },
  ],
};

interface Props {
  tripId: number;
  members: Participant[]; // 여행 멤버 목록 (결제자 선택용)
  onSubmit: (expense: Expense) => void; // 이대로 반영하기 눌렀을 때
}

export default function AddExpenseForm({ tripId, members, onSubmit }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 첨부 여부
  const [imageAttached, setImageAttached] = useState(false);

  // OCR로 채워지는 데이터 (지금은 더미)
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState<ExpenseItem[]>([]);

  // 유저가 선택하는 값
  const [splitType, setSplitType] = useState<"개인" | "더치">("더치");
  const [payerUserId, setPayerUserId] = useState<number>(
    members[0]?.user_id ?? 0,
  );

  // 영수증 사진 추가 클릭 → 파일 선택창 열기
  function handleImageClick() {
    fileInputRef.current?.click();
  }

  // 파일 선택 시 → 더미 OCR 데이터로 채우기 (나중에 실제 API 연동)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setImageAttached(true);
    setTitle(DUMMY_OCR.title);
    setTotalAmount(DUMMY_OCR.total_amount);
    setItems(DUMMY_OCR.items);
  }

  // 이대로 반영하기
  function handleSubmit() {
    const payer = members.find((m) => m.user_id === payerUserId);
    if (!payer) return;

    const newExpense: Expense = {
      expense_id: Date.now(), // 임시 id (실제 연동 시 서버에서 받음)
      title,
      total_amount: totalAmount,
      expense_type: "추가금액",
      split_type: splitType,
      payment_time: new Date().toISOString(),
      payer,
      item_count: items.length,
      items,
    };

    onSubmit(newExpense);
    router.back();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-6 pb-10">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="text-2xl mb-4 self-start"
      >
        &lt;
      </button>

      {/* 영수증 사진 추가 버튼 */}
      <button
        onClick={handleImageClick}
        className="w-full py-4 text-xl bg-[#E5E5FE] text-black mb-6"
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

      {/* 사진 첨부 전: 빈 화면 */}
      {!imageAttached && <div className="flex-1" />}

      {/* 사진 첨부 후: OCR 결과 + 입력폼 */}
      {imageAttached && (
        <div
          className="w-full"
          style={{
            backgroundImage: "url('/whiteboxnew.png')",
            backgroundSize: "100% 100%",
            padding: "14px 28px",
          }}
        >
          {/* 제목 */}
          <p className="text-xl font-normal text-black pb-2">{title}</p>

          {/* 총 금액 */}
          <p className="text-xl text-black pb-1">
            {totalAmount.toLocaleString()}원
          </p>

          {/* 메뉴 목록 */}
          <div className="border-t border-b border-dashed border-gray-400 py-2 mb-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-lg text-black py-0.5"
              >
                <span>{item.item_name}</span>
                <span>{item.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          {/* 날짜 표시 */}
          <p className="text-base text-[#0C6DFF] mb-2">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* 바코드 이미지 */}
          <img src="/barcode.png" alt="barcode" className="w-full mb-6" />

          {/* 결제자 선택 */}
          <div className="mb-4">
            <p className="text-lg text-black mb-1">결제자 선택</p>
            <div className="flex gap-2 flex-wrap">
              {members.map((m) => (
                <button
                  key={m.user_id}
                  onClick={() => setPayerUserId(m.user_id)}
                  className="px-4 py-1 text-lg"
                  style={{
                    backgroundColor:
                      payerUserId === m.user_id ? "#85B5FF" : "#E5E5FE",
                    color: "black",
                  }}
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>

          {/* 개인메뉴 / 더치페이 선택 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSplitType("개인")}
              className="flex-1 py-2 text-xl text-black"
              style={{
                backgroundColor: splitType === "개인" ? "#0C6DFF" : "#E5E5FE",
                color: splitType === "개인" ? "white" : "black",
              }}
            >
              개인 메뉴
            </button>
            <button
              onClick={() => setSplitType("더치")}
              className="flex-1 py-2 text-xl text-black"
              style={{
                backgroundColor: splitType === "더치" ? "#0C6DFF" : "#E5E5FE",
                color: splitType === "더치" ? "white" : "black",
              }}
            >
              더치페이
            </button>
          </div>
        </div>
      )}

      {/* 이대로 반영하기 버튼 — 사진 첨부 후에만 활성화 */}
      <button
        onClick={handleSubmit}
        disabled={!imageAttached}
        className="w-full py-4 text-xl text-white mt-6"
        style={{
          backgroundColor: imageAttached ? "#0C6DFF" : "#C0C0C0",
        }}
      >
        이대로 반영하기
      </button>
    </div>
  );
}
