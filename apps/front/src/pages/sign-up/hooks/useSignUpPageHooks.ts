import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type SignUpInputDto, SignUpInputDtoSchema } from "../api/schema";
import { signupServerFn } from "../api/signupServerFn";
import type { SignUpPageProps } from "../model";

export const useSignUpPageHooks = (): SignUpPageProps => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleForm = useForm({
    mode: "onSubmit",
    resolver: valibotResolver<SignUpInputDto, unknown, SignUpInputDto>(
      SignUpInputDtoSchema,
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signupServerFn,
    onSuccess: async () => {
      setServerError(null);
      navigate({ to: "/" });
    },
    onError: (error: Error) => {
      setServerError(
        error.message || "サインアップ中に予期せぬエラーが発生しました。",
      );
    },
  });

  const onSubmit: SubmitHandler<SignUpInputDto> = (input) => {
    signUpMutation.mutate({ data: input });
  };

  const navigateToSignin = () => {
    navigate({ to: "/signin" });
  };

  return {
    handleForm,
    serverError,
    onSubmit,
    navigateToSignin,
    isLoading: signUpMutation.isPending,
  };
};
