import type { Config } from "tailwindcss";

const config: Config = {
  // shadcn/ui가 스타일을 입힐 파일들의 경로를 지정해
  content: [
    "./src/**/*.{ts,tsx}", 
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 여기에 shadcn/ui 초기화 시 생성된 색상 변수들이 들어갈 거야
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;