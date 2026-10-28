/// <reference types="vite/client" />

// .env 파일에서 읽어오는 환경변수의 타입 정의
interface ImportMetaEnv {
  readonly VITE_USE_FIREBASE?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
