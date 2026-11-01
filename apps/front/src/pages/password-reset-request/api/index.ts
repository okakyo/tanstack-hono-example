import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { PasswordResetRequestPageProps } from "../model";
import { resetPasswordRequestServerFn } from "./resetPasswordRequestServerFn";
import {
  type ResetPasswordRequestInputDto,
  resetPasswordRequestInputDtoSchema,
} from "./schema";

/**
 * パスワードリセットリクエストページのロジックを管理するカスタムフック
 *
 * このフックは、パスワードリセットメール送信処理、フォーム状態管理、
 * ナビゲーションなどのすべてのビジネスロジックを担当します。
 * React Hook Form と Valibot を使用してフォームのバリデーションを行います。
 */
export const usePasswordResetRequestPageHooks =
  (): PasswordResetRequestPageProps => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // フォームの状態管理
    const handleForm = useForm<ResetPasswordRequestInputDto>({
      mode: "onSubmit",
      resolver: valibotResolver<
        ResetPasswordRequestInputDto,
        unknown,
        ResetPasswordRequestInputDto
      >(resetPasswordRequestInputDtoSchema),
      defaultValues: {
        email: "",
      },
    });

    /**
     * パスワードリセットリクエスト Mutation
     * TanStack Query を使用してパスワードリセットメール送信を管理します
     */
    const resetPasswordRequestMutation = useMutation({
      mutationFn: resetPasswordRequestServerFn,
      onSuccess: async () => {
        setServerError(null);
        setSuccessMessage(
          "パスワードリセット用のメールを送信しました。メールをご確認ください。",
        );
        // フォームをリセット
        handleForm.reset();
      },
      onError: (error: Error) => {
        setSuccessMessage(null);
        setServerError(
          error.message || "メールの送信中に予期せぬエラーが発生しました。",
        );
      },
    });

    /**
     * フォームの送信処理
     */
    const onSubmit: SubmitHandler<ResetPasswordRequestInputDto> = (data) => {
      setServerError(null);
      setSuccessMessage(null);
      resetPasswordRequestMutation.mutate({ data });
    };

    /**
     * サインインページへのナビゲーション
     */
    const navigateToSignIn = () => {
      navigate({ to: "/signin" });
    };

    return {
      handleForm,
      serverError,
      successMessage,
      onSubmit,
      navigateToSignIn,
      isLoading: resetPasswordRequestMutation.isPending,
    };
  };
