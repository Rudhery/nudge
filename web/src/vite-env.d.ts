/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API. Empty = same origin (dev proxy / prod Go server). */
  readonly VITE_API_URL?: string
  /** Bearer token, only needed when the backend has API_KEY set. */
  readonly VITE_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
