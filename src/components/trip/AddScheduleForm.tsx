"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import { ScheduleRequest } from "@/types";

// 30분 단위 시간 옵션 생성 (00:00 ~ 23:30)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hh = String(Math.floor(i / 2)).padStart(2, "0");
  const mm = i % 2 === 0 ? "00" : "30";
  return `${hh}:${mm}`;
});

interface Props {
  //title,content는 여기서 입력해서 없는거임.
  tripId: number;
  tripDates: string[]; // ["2026-05-01", "2026-05-02", ...] 여행 기간 날짜 목록
  onSubmit: (schedule: ScheduleRequest) => void | Promise<void>; //서버에 보내는 타입으로 변경함 
}

export default function AddScheduleForm({
  tripId,
  tripDates,
  onSubmit,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(tripDates[0] ?? "");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // 날짜 "5월 1일" 형식으로 표시
  function formatDateLabel(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  async function handleSubmit() {
    if (!title.trim()) return;

    const newSchedule: ScheduleRequest = {
      //schedule_id: Date.now(), // 임시 id (실제 연동 시 서버에서 받음)
      schedule_date: selectedDate,
      schedule_time: `${selectedDate}T${selectedTime}:00`,
      title: title.trim(),
      content: content.trim(),
    };

    try{
    await onSubmit(newSchedule);
    router.push(`/trip/${tripId}?tab=일정`);
    } catch{
    //에러 처리는 add-schedule 에서 함. 에러 시 페이지 이동 못하게 한 거임
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="일정추가" />

      <div className="flex flex-col gap-4 px-4 mt-4">
        {/* 제목 입력 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="여행 이름 입력"
          className="w-full py-7 font-bold text-center text-2xl bg-[#E5E5FE] rounded-xl placeholder-gray-400 outline-none"
        />

        {/* 날짜 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => {
              setDateOpen((v) => !v);
              setTimeOpen(false);
            }}
            className="w-full flex items-center justify-between py-4 px-5 text-2xl font-bold bg-[#E5E5FE] rounded-xl"
          >
            <span className="flex items-center gap-1">
              날짜 <ChevronDown size={30} strokeWidth={3} />
            </span>
            <span>{formatDateLabel(selectedDate)}</span>
          </button>

          {dateOpen && (
            <div className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-xl shadow-md z-30 max-h-48 overflow-y-auto">
              {/*absolute: 부모(날짜박스) 기준으로 위치 고정*/}
              {tripDates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setDateOpen(false);
                  }}
                  className={`block w-full text-center px-5 py-3 text-xl ${
                    date === selectedDate
                      ? "text-blue-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {formatDateLabel(date)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 시간 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => {
              setTimeOpen((v) => !v);
              setDateOpen(false);
            }}
            className="w-full flex items-center justify-between py-4 px-5 text-2xl font-bold bg-[#E5E5FE] rounded-xl"
          >
            <span className="flex items-center gap-1">
              시간 <ChevronDown size={30} strokeWidth={3} />
            </span>
            <span>{selectedTime}</span>
          </button>

          {timeOpen && (
            <div className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-xl shadow-md z-30 max-h-48 overflow-y-auto">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTime(t); //t로 time을 바꾼다.
                    setTimeOpen(false);
                  }}
                  className={`block w-full text-center px-5 py-3 text-xl ${
                    t === selectedTime
                      ? "text-blue-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 내용 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="일정 내용 입력"
          rows={4}
          className="w-full py-4 px-4 text-2xl bg-[#E5E5FE] rounded-xl placeholder-gray-400 outline-none resize-none" //resize-none: 입력칸 사용자가 늘리는거 방지
        />
      </div>

      <Button
        label="이대로 반영하기"
        onClick={handleSubmit}
        disabled={!title.trim()}
        fixed
      />
    </div>
  );
}
