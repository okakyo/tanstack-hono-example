import type { Context } from "hono";
import type { HTTPException } from "hono/http-exception";
import type {
  ClientErrorStatusCode,
  ContentfulStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import type { Result } from "neverthrow";

type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

/**
 * エラー結果を統一形式の JSON レスポンスとして返すヘルパー関数
 * status を 4xx / 5xx に絞ることで、クライアントの InferResponseType<..., 200> に
 * エラー用のレスポンス型(data: null)が混ざらないようにする。
 * @param c - HonoのContext
 * @param error - HTTPException
 * @returns エラーレスポンスJSON
 */
export const errorResponse = (c: Context, error: HTTPException) => {
  return c.json(
    { success: false, data: null, message: error.message },
    error.status as ErrorStatusCode,
  );
};

/**
 * ユースケースの結果を統一的に処理するヘルパー関数
 * @param c - HonoのContext
 * @param result - neverthrowのResult型
 * @param successStatus - 成功時のHTTPステータスコード（デフォルト: 200）
 * @param successMessage - 成功時のメッセージ（デフォルト: ""）
 * @returns レスポンスJSON
 */
export const handleResult = <T>(
  c: Context,
  result: Result<T, HTTPException>,
  successStatus: ContentfulStatusCode = 200,
  successMessage: string = "",
) => {
  if (result.isErr()) {
    return errorResponse(c, result.error);
  }
  return c.json(
    { success: true, data: result.value, message: successMessage },
    successStatus,
  );
};
