export interface Participant {
  user_id: number;
  nickname: string;
}

export interface ExpenseItem { // 메뉴하나
  item_name: string;
  price: number;
  participants: Participant[];
}

export interface Expense { // 영수증 하나
  expense_id: number;
  title: string;
  total_amount: number;
  expense_type: "고정금액" | "추가금액";
  split_type?: "개인" | "더치"; //추가금액일때만 표시
  payment_time?: string;
  receipt_image_url?: string;
  payer: Participant;
  item_count: number; //메뉴개수
  items: ExpenseItem[]; //각 메뉴
}

export interface ScheduleRequest { //일정 추가 시 서버에 보내는 데이터 (schedule_id 없음, 명세서 3.1) 
  schedule_date: string;    // "2026-05-01"
  schedule_time: string;    // "2026-05-01T12:00:00"
  title: string;
  content: string;
}

// 참여자 목록 조회 시 서버에서 받는 데이터 (명세서 2.3)
export interface MemberResponse {
  user_id: number;
  nickname: string;
  //role?: "방장" | "일반";   //역할 삭제
}

// 여행방 목록 조회 응답 (명세서 2.2)
export interface TripListItem {
  trip_id: number;
  title: string;
  nation: string;
  start_date: string;  // "YYYY-MM-DD"
  end_date: string;    // "YYYY-MM-DD"
  member_count: number;
  my_role: "방장" | "일반"; 
}

// 초대 코드로 여행 참여 요청 타입 (명세서 2.4)
export interface JoinTripRequest {
  invite_code: string;
}

// 여행방 생성 요청 타입
export interface TripRequest {
  title: string;
  nation: string;
  start_date: string; // "YYYY-MM-DD" 형식
  end_date: string;   // "YYYY-MM-DD" 형식
}

// 여행방 생성 응답 타입
export interface TripResponse {
  trip_id: number;
  title: string;
  invite_code: string;
}

export interface ExpenseItemRequest {
  item_name: string;
  price: number;
  participant_user_ids: number[]; // 빈 배열 = 전체 N빵
}

export interface ExpenseRequest {
  title: string;
  total_amount: number;
  expense_type: "고정금액" | "추가금액";
  payment_time?: string;
  currency?: string;
  exchange_rate?: number;
  receipt_image_url?: string;
  payer_user_id: number;
  items: ExpenseItemRequest[];
}

// ── OCR 응답 타입 (명세서 4.1) ──
export interface OcrResponse {
  parsed_title: string;
  parsed_total_amount: number;
  parsed_items: {
    item_name: string;
    price: number;
  }[];
}