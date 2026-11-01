import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Field,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { SignUpPageProps } from "../model";

/**
 * サインインページのUIコンポーネント
 *
 * React Hook Form を使用して、メールアドレスとパスワードでログインするためのフォームを表示します。
 * Valibot によるバリデーションを実装し、エラーメッセージを表示します。
 * Google アカウントでのログインもサポートしています。
 *
 * @param props - SignUpPageProps型のプロパティ
 */
export const SignUpPageUi = (props: SignUpPageProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    serverError,
    handleForm: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
    isLoading,
  } = props;

  return (
    <Container maxW="md" py={12}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <VStack gap={8} border="1px solid" p={8} borderRadius="md">
          <Heading size="lg">アカウント登録</Heading>

          {/* サーバーエラーメッセージの表示 */}
          {serverError && (
            <Box p={4} bg="red.100" borderRadius="md" w="full">
              <Text color="red.700">{serverError}</Text>
            </Box>
          )}

          {/* ログインフォーム */}
          <VStack gap={4} width="100%">
            {/* メールアドレス入力 */}
            <Field.Root invalid={!!errors.email} width="100%">
              <Field.Label htmlFor="email">メールアドレス</Field.Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="example@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <Field.ErrorText>{errors.email.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* パスワード入力 */}
            <Field.Root invalid={!!errors.password} width="100%">
              <Field.Label htmlFor="password">パスワード</Field.Label>
              <InputGroup
                endElement={
                  <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label={
                      isPasswordVisible
                        ? "パスワードを非表示にする"
                        : "パスワードを表示する"
                    }
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    disabled={isLoading}
                  >
                    <Icon as={isPasswordVisible ? LuEyeOff : LuEye} />
                  </IconButton>
                }
              >
                <Input
                  id="password"
                  {...register("password")}
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="パスワードを入力してください"
                  disabled={isLoading}
                />
              </InputGroup>
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root invalid={!!errors.confirmPassword} width="100%">
              <Field.Label htmlFor="confirmPassword">
                パスワード（確認用）
              </Field.Label>
              <InputGroup
                endElement={
                  <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label={
                      isConfirmPasswordVisible
                        ? "確認用パスワードを非表示にする"
                        : "確認用パスワードを表示する"
                    }
                    onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                    disabled={isLoading}
                  >
                    <Icon as={isConfirmPasswordVisible ? LuEyeOff : LuEye} />
                  </IconButton>
                }
              >
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="もう一度パスワードを入力してください"
                  disabled={isLoading}
                />
              </InputGroup>
              {errors.confirmPassword && (
                <Field.ErrorText>
                  {errors.confirmPassword.message}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* 登録ボタン */}
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              disabled={isLoading}
            >
              登録
            </Button>
          </VStack>

          {/* サインアップページへのリンク */}
          <Text fontSize="sm" color="gray.600">
            <ChakraLink as={Link} color="blue.500" href="/signin">
              ログイン画面へ戻る
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};
