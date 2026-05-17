"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScheduleStore } from "@/store/useScheduleStore";

function formatTimeParts(iso: string) {
  // ISO 날짜 문자열에서 시(hh)와 분(mm)을 분리해서 반환 (영수증 탭과 동일 방식)
  const d = new Date(iso);
  return {
    hh: String(d.getHours()).padStart(2, "0"),
    mm: String(d.getMinutes()).padStart(2, "0"),
  };
}

function groupByDay<T extends { schedule_date: string; schedule_time: string }>(
  schedules: T[],
) {
  // 날짜별로 묶고 DAY 1, DAY 2... 라벨 붙이기 (groupByDay in ExpenseTab과 동일 구조)
  const dates = [...new Set(schedules.map((s) => s.schedule_date))].sort();

  return dates.map((date, i) => ({
    label: `DAY ${i + 1}`,
    items: schedules.filter((s) => s.schedule_date === date),
  }));
}

interface ScheduleCardProps {
  title: string;
  content: string;
}

function ScheduleCard({ title, content }: ScheduleCardProps) {
  return (
    <div
      style={{
        backgroundImage: "url('/whiteboxnew.png')",
        backgroundSize: "100% 100%",
        padding: "14px 28px",
      }}
    >
      <p className="font-normal text-xl pb-4">{title}</p>
      <p className="font-normal text-xl">{content}</p>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────

export default function ScheduleTab() {
  const { schedules } = useScheduleStore();
  const dayGroups = groupByDay(schedules);

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeGroup = dayGroups[activeDayIdx];

  return (
    <div className="pb-6 px-4">
      <div className="mt-3 mb-3">
        <div className="relative inline-block">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center text-2xl font-normal text-black"
          >
            {activeGroup?.label ?? "DAY 1"}
            <ChevronDown size={30} strokeWidth={3} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded shadow-md z-30">
              {dayGroups.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => {
                    setActiveDayIdx(i);
                    setDropdownOpen(false);
                  }}
                  className={`block w-full text-center px-5 py-2 text-lg ${
                    i === activeDayIdx
                      ? "text-blue-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 타임라인 (ExpenseTab과 완전히 동일한 구조) */}
      {activeGroup && (
        <div className="relative flex flex-col gap-4">
          <img
            src="/DT.png"
            alt=""
            className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 pointer-events-none z-0"
            style={{
              top: "50%",
              width: "50vw",
              maxWidth: "300px",
              minWidth: "150px",
            }}
          />
          {/* 세로 그라데이션 바 */}
          <div
            className="absolute top-2 bottom-0"
            style={{
              width: "40px",
              borderRadius: "11px",
              background:
                "linear-gradient(to bottom, #0C6DFF 0%, #87B7FF 66%, #FFFFFF 100%)",
            }}
          />

          {activeGroup.items.map((s) => {
            const { hh, mm } = formatTimeParts(s.schedule_time);
            return (
              <div key={s.schedule_id} className="flex items-center">
                {/* 시간 표시 */}
                <div className="w-10 flex-shrink-0 flex flex-col items-center text-2xl font-normal text-black z-10 leading-tight">
                  <span>{hh}</span>
                  <span>{mm}</span>
                </div>

                {/* 카드 */}
                <div className="flex-1 min-w-0 ml-4 relative z-10">
                  <ScheduleCard title={s.title} content={s.content} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
