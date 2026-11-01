/**
 * Supabase JWT 認証ミドルウェア (JWT Signing Keys 使用)
 *
 * API リクエストのヘッダーに含まれる JWT トークンを検証し、
 * 認証されたユーザー情報をコンテキストに追加します。
 *
 * このミドルウェアは、JWT Signing Keys（公開鍵暗号方式 RS256）を使用して
 * Supabase の JWKS エンドポイントから公開鍵を取得し、トークンを検証します。
 *
 * JWT Secret Key (HS256) よりも安全で、鍵のローテーションにも対応しています。
 */

import type { JwtPayload } from "@supabase/supabase-js";
import dotenv from "dotenv";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyWithJwks } from "hono/jwt";

dotenv.config();

const SUPABASE_ALLOWED_JWT_ALGORITHMS = ["RS256", "ES256"] as const;

/**
 * Supabase URL を取得し、バリデーションを行う関数
 * @returns Supabase URL
 * @throws 環境変数が設定されていない、または不正な形式の場合はエラー
 */
function getSupabaseUrl(): string {
  const SUPABASE_URL = process.env.SUPABASE_URL || "";

  if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not set");
  }

  // JWKS の取得には absolute URL が必要
  if (!/^https?:\/\//u.test(SUPABASE_URL)) {
    throw new Error("SUPABASE_URL must be an absolute URL (https://...)");
  }

  return SUPABASE_URL;
}

/**
 * JWT トークンを検証して、ユーザー情報を取得する関数
 *.
 * JWKS で公開鍵を取得し、許可したアルゴリズムでトークンを検証します。
 * これにより、サーバー側で秘密鍵を保持する必要がなく、より安全です。
 *
 * @param token - Bearer トークン
 * @returns ユーザー情報 (SupabaseJWTPayload)
 * @throws トークンが無効な場合はエラー
 */

export async function verifySupabaseToken(
  token: string,
): Promise<JwtPayload | undefined> {
  try {
    const SUPABASE_URL = getSupabaseUrl();

    // JWT トークンを JWKS から取得した公開鍵で検証
    const result = await verifyWithJwks(token, {
      jwks_uri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
      // プロジェクト設定差異に対応するため、Supabaseで一般的な署名方式を許可します。
      allowedAlgorithms: [...SUPABASE_ALLOWED_JWT_ALGORITHMS],
    });
    const authId = result.sub;
    if (!authId) {
      throw new Error("トークンにユーザーIDが含まれていません");
    }

    // TODO アカウント情報（認可に必要な情報）を取得し、返却する
    return result as JwtPayload;
  } catch (_error) {
    return undefined;
  }
}

/**
 * 認証ミドルウェア
 *
 * リクエストヘッダーから JWT トークンを取得し、検証します。
 * 検証に成功すると、ユーザー情報をコンテキストに保存します。
 *
 * 使用例:
 * ```typescript
 * app.use('/api/protected/*', verifyJwtMiddleware)
 * app.get('/api/protected/data', (c) => {
 *   const userId = c.req.header('authUserId');
 *   return c.json({ message: `Hello, user ${userId}` });
 * })
 * ```
 */
export const verifyJwtMiddleware = async (c: Context, next: Next) => {
  // Authorization ヘッダーから Bearer トークンを取得
  const authorizationHeader = c.req.header("Authorization");

  const bearerToken = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.replace("Bearer ", "").trim()
    : undefined;

  if (!bearerToken) {
    throw new HTTPException(401, {
      message: "認証トークンが見つかりません。",
    });
  }

  try {
    const existingJwtPayload = c.get("jwtPayload");
    if (existingJwtPayload) {
      // すでにペイロードがコンテキストに存在する場合は再利用
      await next();
      return;
    }

    // JWKS を使用してトークンを検証し、検証済みのペイロードを取得
    const verifiedJwtPayload = await verifySupabaseToken(bearerToken);
    if (!verifiedJwtPayload) {
      throw new HTTPException(401, {
        message: "認証に失敗しました。もう一度ログインしてください。",
      });
    }
    // 検証に成功したら、完全なペイロード情報をコンテキストに保存
    c.set("jwtPayload", { payload: verifiedJwtPayload });

    // 次のミドルウェアまたはハンドラーに処理を渡す
    await next();
  } catch (_error) {
    throw new HTTPException(401, {
      message: "認証に失敗しました。もう一度ログインしてください。",
    });
  }
};

/**
 * 型安全性のために、コンテキストの型を拡張
 */
declare module "hono" {
  interface ContextVariableMap {
    /** 完全なJWTペイロード情報 */
    jwtPayload: { payload: JwtPayload };
  }
}
