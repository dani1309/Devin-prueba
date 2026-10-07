/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXCHANGE_RATE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
