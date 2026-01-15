// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }