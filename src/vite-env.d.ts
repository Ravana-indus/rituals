/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_PAYHERE_MERCHANT_ID: string
  readonly VITE_PAYHERE_CALLBACK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
