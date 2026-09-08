/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional full-stack application origin for a separately hosted landing. */
  readonly VITE_APP_URL?: string;
  /** Optional public landing origin used by the central application login page. */
  readonly VITE_LANDING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
