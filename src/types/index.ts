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