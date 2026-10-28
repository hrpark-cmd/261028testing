/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 사이트 포인트 색상 (차분한 남색). 바꾸려면 이 값만 수정하세요.
        brand: {
          50: "#eff4fb",
          100: "#dbe5f4",
          600: "#2a5599",
          700: "#1f4580",
          800: "#1a3866",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "-apple-system", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
