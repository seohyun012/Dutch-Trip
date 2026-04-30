import { Decimal } from 'decimal.js';

// 총 금액을 참여 인원수로 나누는 정밀 계산 함수
export const splitAmount = (total: number, memberCount: number) => {
  if (memberCount === 0) return 0;
  // 소수점 오차 없이 계산 후 원 단위 절사
  return new Decimal(total).div(memberCount).toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
};