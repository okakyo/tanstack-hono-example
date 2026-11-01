import { getContext } from "hono/context-storage";
import type { HTTPException } from "hono/http-exception";
import { pino } from "pino";

const PINO_CONFIG = {
  formatters: {
    level: (label: string) => {
      return {
        level: label.toUpperCase(),
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const logger = () => pino(PINO_CONFIG);

const baseLogger = () => {
  const ctx = getContext();
  const { requestId } = ctx.var;
  const userId = ctx.req.header("x-user-id") ?? "unknown";

  return logger().child({ requestId, userId });
};

export const debugLogger = (message: string, ...rest: string[]) => {
  baseLogger().debug({ status: "IGNORED", message: message, params: rest });
};

export const infoLogger = (message: string, options: string[]) => {
  baseLogger().info({ status: "SUCCESS", message: message, options });
};

export const errorLogger = (error: HTTPException) => {
  baseLogger().error({
    status: "FAILED",
    statusCode: error.status,
    message: error.message,
    cause: error.cause,
  });
};

// FATALログは サーバー内でのエラーでリクエスト情報がないため、baseLogger は使わない
export const fatalLogger = (error: Error) => {
  logger().fatal({
    status: "FAILED",
    statusCode: 500,
    message: error.message,
    stack: error.stack,
  });
};

export const apiLogger = (str: string, ...rest: string[]) => {
  const [direction, method, path] = str.split(" ");

  const isResponse = direction.includes(">");
  if (isResponse) {
    baseLogger().info({
      status: "SUCCESS",
      method: method,
      path: path,
      params: rest,
    });
  }
};
