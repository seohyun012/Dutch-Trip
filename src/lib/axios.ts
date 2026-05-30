import axios from "axios";

// Axios 인스턴스 생성: 모든 API 요청의 공통 설정을 여기서 관리
const api = axios.create({
  baseURL: "https://dutchtrip.duckdns.org/api",
  // Content-Type 기본값 제거 → 요청마다 자동 감지
});

// 요청 인터셉터: 매 요청마다 자동으로 토큰을 헤더에 붙여줌
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;