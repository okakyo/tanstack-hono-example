/**
 * サーバー起動エントリーポイント
 * このファイルは直接実行される場合のみサーバーを起動します
 */
import { serve } from "@hono/node-server";
import { app } from "./app";
import { fatalLogger } from "./libs/utils/logger";

// このファイルをフロントエンドからインポートしないでください
// 型とクライアントが必要な場合は ./client.ts をインポートしてください
export type { AppType } from "./app";
export type { AppEnv } from "./app.env";
export { honoApiClient } from "./client";

try {
  const port = Number.parseInt(process.env.PORT || "3100", 10);
  console.log(`Server is running on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
} catch (e) {
  const error = e instanceof Error ? e : new Error("Failed to start server");
  fatalLogger(error);
  process.exit(1);
}
