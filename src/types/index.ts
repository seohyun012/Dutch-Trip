export interface Participant {
  user_id: number;
  nickname: string;
}

export interface ExpenseItem {
  item_name: string;
  price: number;
  participant_user_ids?: number[]; // ? 추가 → 없어도 됨
  participants: Participant[];
}

export interface Expense {
  expense_id: number;
  title: string;
  total_amount: number;
  expense_type: "고정금액" | "추가금액";
  payment_time?: string;
  payer: Participant;
  item_count: number;
  items: ExpenseItem[];
}