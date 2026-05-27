"use client";

import { useRef, useState } from "react";
// <input type="file" />은 못생겨서 숨겨두고, 버튼 클릭하면 useRef로 숨겨진 input을 코드로 클릭하는 방식
import { useRouter } from "next/navigation";
import type { Expense, ExpenseItem, Participant, OcrResponse } from "@/types";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import {
  useOcrMutation,
  useCreateExpenseMutation,
} from "@/hooks/mutations/useExpenseMutation";
import { useTripQuery } from "@/hooks/queries/useTripQuery";

interface Props {
  tripId: number;
  members: Participant[]; // 여행멤버 타입을 설정해준거
}

export default function AddExpenseForm({ tripId, members }: Props) {
  const { data: trip } = useTripQuery(tripId);
  const router = useRouter(); //페이지 이동을 위한 훅
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 첨부 여부
  const [imageAttached, setImageAttached] = useState(false);
  const [title, setTitle] = useState("");
  //title: 제목 저장 변수, setTitle: title을 변경하는 함수(함수실행에서 인수를 넣어주면 그걸로)
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentTime, setPaymentTime] = useState("");
  const [items, setItems] = useState<ExpenseItem[]>([]);
  //ExpenseItem타입 배열로 items를 주겠다.

  const [itemParticipants, setItemParticipants] = useState<
    Record<string, number[]>
  >({});

  const { mutateAsync: runOcr, isPending: isOcrLoading } =
    useOcrMutation(tripId);
  const { mutateAsync: createExpense, isPending: isSubmitting } =
    useCreateExpenseMutation(tripId);

  // 유저가 선택하는 값
  const [splitType, setSplitType] = useState<"개인" | "더치">("더치");
  const [payerUserId, setPayerUserId] = useState<number | null>(null);

  // 영수증 사진 추가 클릭 → 파일 선택창 열기
  function handleImageClick() {
    fileInputRef.current?.click(); //못생긴 인풋대신 내 버튼 눌러도 인풋 적용되게
  }

  // 파일 선택 시 → 더미 OCR 데이터로 채우기 (나중에 실제 API 연동)
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await runOcr(file);
    setImageAttached(true);
    setTitle(result.parsed_title);
    setTotalAmount(result.parsed_total_amount);
    // OCR 아이템을 ExpenseItem 형태로 변환 (participants는 빈 배열)
    setItems(
      result.parsed_items.map((i: OcrResponse["parsed_items"][number]) => ({
        ...i,
        participants: [],
      })),
    );
  }

  function toggleItemParticipant(itemName: string, userId: number) {
    setItemParticipants((prev) => {
      const current = prev[itemName] ?? [];
      const next = current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId];
      return { ...prev, [itemName]: next };
    });
  }

  // 이대로 반영하기
  async function handleSubmit() {
    if (!payerUserId) return;

    await createExpense({
      title,
      total_amount: totalAmount,
      expense_type: "추가금액",
      payment_time: paymentTime || undefined,
      payer_user_id: payerUserId,
      items: items.map((item) => ({
        item_name: item.item_name,
        price: item.price,
        // 더치: 빈 배열(서버가 전체 N빵 처리), 개인: 선택된 참여자
        participant_user_ids:
          splitType === "더치" ? [] : (itemParticipants[item.item_name] ?? []),
      })),
    });

    router.push(`/trip/${tripId}?tab=영수증`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white ">
      {/*min-h-screen: 내용이 적어도 화면 전체를 채우고, 내용이 많으면 그 이상으로 늘어남.*/}
      <Header title={trip?.title ?? ""} />
      {/* 영수증 사진 추가 버튼 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="py-6 text-2xl font-bold bg-[#E5E5FE] text-black rounded-xl mt-4 mx-4"
      >
        {isOcrLoading ? "분석 중..." : "영수증 사진 추가"}
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
