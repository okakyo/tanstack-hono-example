import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toaster } from "@/shareds/ui/base-toaster";
import type { SignInPageProps } from "../model";
import { type LoginInputDto, loginInputDtoSchema } from "./schema";
import { signinServerFn } from "./signinServerFn";

/**
 * サインインページのロジックを管理するカスタムフック
 *
 * このフックは、認証処理、フォーム状態管理、ナビゲーションなどの
 * すべてのビジネスロジックを担当します。
 * React Hook Form と Valibot を使用してフォームのバリデーションを行います。
 */
export const useSignInPageHooks = (): SignInPageProps => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // フォームの状態管理
  const handleForm = useForm({
    mode: "onSubmit",
    resolver: valibotResolver<LoginInputDto, unknown, LoginInputDto>(
      loginInputDtoSchema,
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * サインイン Mutation
   * TanStack Query を使用してログイン処理を管理します
   */
  const signInMutation = useMutation({
    mutationFn: signinServerFn,
    onSuccess: async () => {
      setServerError(null);
      toaster.create({
        type: "success",
        description: "ログインに成功しました！",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      setServerError(
        error.message || "ログイン中に予期せぬエラーが発生しました。",
      );
    },
  });

  /**
   * ログインフォームの送信処理
   */
  const onSubmit: SubmitHandler<LoginInputDto> = (data) => {
    setServerError(null); // エラーをクリア
    signInMutation.mutate({ data });
  };

  /**
   * サインアップページへのナビゲーション
   */
  const navigateToSignup = () => {
    navigate({ to: "/signup" });
  };

  return {
    handleForm,
    serverError,
    onSubmit,
    navigateToSignup,
    isLoading: signInMutation.isPending,
  };
};
