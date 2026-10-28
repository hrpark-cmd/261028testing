/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 주 색상(남색). 사이트 분위기를 바꾸려면 이 값들을 수정하세요.
        brand: {
          50: "#f1f5fb",
          100: "#e1e9f5",
          200: "#c3d3ea",
          300: "#97b3d9",
          400: "#6a8fc4",
          500: "#4a71ad",
          600: "#375a93",
          700: "#2c4878",
          800: "#233a61",
          900: "#1b2d4b",
          950: "#111d33",
        },
        // 포인트 색상(금색). 강조 문구·작은 장식에만 조금씩 사용합니다.
        accent: {
          50: "#fdf8ed",
          100: "#f8ecce",
          300: "#ebc66f",
          400: "#e0a83a",
          500: "#c98f1f",
          600: "#a87214",
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "system-ui", "-apple-system", '"Apple SD Gothic Neo"', '"Malgun Gothic"', "sans-serif"],
        serif: ['"Noto Serif KR"', '"Nanum Myeongjo"', "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px -4px rgba(16,24,40,0.08)",
        lift: "0 2px 4px rgba(16,24,40,0.04), 0 16px 32px -12px rgba(16,24,40,0.18)",
      },
    },
  },
  plugins: [],
};
