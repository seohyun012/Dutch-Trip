import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 시작일과 종료일 사이의 모든 날짜를 배열로 반환
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  // 시작일부터 종료일까지 하루씩 더하면서 배열에 추가
  while (current <= end) {
    // "YYYY-MM-DD" 형식으로 변환
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);

    // 하루 더하기
    current.setDate(current.getDate() + 1);
  }

  return dates;
}