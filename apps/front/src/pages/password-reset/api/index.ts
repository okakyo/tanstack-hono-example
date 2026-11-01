import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { PasswordResetPageProps } from "../model";
import {
  type ResetPasswordInputDto,
  resetPasswordInputDtoSchema,
} from "./schema";
import { updatePasswordServerFn } from "./updatePasswordServerFn";
import { verifyResetCodeServerFn } from "./verifyResetCodeServerFn";

/**
 * パスワードリセットページのロジックを管理するカスタムフック
 *
 * このフックは、パスワード更新処理、フォーム状態管理、
 * ナビゲーションなどのすべてのビジネスロジックを担当します。
 * React Hook Form と Valibot を使用してフォームのバリデーションを行います。
 */
export const usePasswordResetPageHooks = (): PasswordResetPageProps => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(auth)/password-reset" });
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // フォームの状態管理
  const handleForm = useForm<ResetPasswordInputDto>({
    mode: "onSubmit",
    resolver: valibotResolver<
      ResetPasswordInputDto,
      unknown,
      ResetPasswordInputDto
    >(resetPasswordInputDtoSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * パスワード更新 Mutation
   * TanStack Query を使用してパスワード更新処理を管理します
   */
  const updatePasswordMutation = useMutation({
    mutationFn: updatePasswordServerFn,
    onSuccess: async () => {
      setServerError(null);
      setSuccessMessage(
        "パスワードの更新が完了しました。ログインページに移動します。",
      );
      // フォームをリセット
      handleForm.reset();
      // 3秒後にログインページにリダイレクト
      setTimeout(() => {
        navigate({ to: "/signin" });
      }, 3000);
    },
    onError: (error: Error) => {
      setSuccessMessage(null);
      setServerError(
        error.message || "パスワードの更新中に予期せぬエラーが発生しました。",
      );
    },
  });

  /**
   * フォームの送信処理
   */
  const onSubmit: SubmitHandler<ResetPasswordInputDto> = (data) => {
    setServerError(null);
    setSuccessMessage(null);
    updatePasswordMutation.mutate({ data });
  };

  /**
   * サインインページへのナビゲーション
   */
  const navigateToSignIn = () => {
    navigate({ to: "/signin" });
  };

  /**
   * URLのcodeパラメータを検証してセッションを確立
   */
  useEffect(() => {
    const verifyCode = async () => {
      const code = (search as { code?: string }).code;
      if (!code) {
        setVerifyError("パスワードリセットコードが見つかりません");
        setIsVerifying(false);
        // 3秒後にログインページへリダイレクト
        setTimeout(() => {
          navigate({ to: "/signin" });
        }, 3000);
        return;
      }

      try {
        await verifyResetCodeServerFn({ data: { code } });
        setIsVerifying(false);
      } catch (error) {
        console.error("コード検証エラー:", error);
        setVerifyError(
          "パスワードリセットリンクが無効または期限切れです。再度リセットをお試しください。",
        );
        setIsVerifying(false);
        // 3秒後にログインページへリダイレクト
        setTimeout(() => {
          navigate({ to: "/signin" });
        }, 3000);
      }
    };

    verifyCode();
  }, [search, navigate]);

  return {
    handleForm,
    serverError,
    successMessage,
    onSubmit,
    navigateToSignIn,
    isLoading: updatePasswordMutation.isPending,
    isVerifying,
    verifyError,
  };
};
