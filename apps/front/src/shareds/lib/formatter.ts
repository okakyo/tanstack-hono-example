import { format } from "date-fns";

/**
 * 日付を日本標準時でフォーマットします。
 */
export const formatDate = (date: Date): string => {
  return format(date, "yyyy年MM月dd日");
};

/**
 * UTC日付文字列を日本標準時でフォーマットします。
 */
export const formatUTCDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "yyyy年MM月dd日");
};

/**
 * 日本標準時で日付をフォーマットします。
 */
export const formatJTCDate = (date: Date): string => {
  return format(date, "yyyy年MM月dd日");
};
