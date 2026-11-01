/**
 * フロントエンド用のHonoクライアントエクスポート
 * このファイルはサーバーコードを含まず、型情報とクライアントのみを提供します
 */
import { hc } from "hono/client";
import type { AppType } from "./app";

export type { AppType };
export type { InferRequestType, InferResponseType } from "hono/client";

export const honoApiClient = hc<AppType>("http://localhost:3100", {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
  },
});
