/// <reference types="vite/client" />

/**
 * 環境変数の型定義
 *
 * Vite で使用する環境変数の型を定義します。
 * 環境変数は .env.local ファイルに記載してください。
 */
interface ImportMetaEnv {
  /** Supabase のプロジェクト URL */
  readonly VITE_SUPABASE_URL: string;
  /** Supabase の匿名キー（公開可能なキー） */
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
