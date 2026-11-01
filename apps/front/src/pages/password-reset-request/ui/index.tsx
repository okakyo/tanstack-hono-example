import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { PasswordResetRequestPageProps } from "../model";

/**
 * パスワードリセットリクエストページのUIコンポーネント
 *
 * メールアドレスを入力してパスワードリセット用のメールを送信するためのフォームを表示します。
 * React Hook Form を使用し、Valibot によるバリデーションを実装しています。
 *
 * @param props - PasswordResetRequestPageProps型のプロパティ
 */
export const PasswordResetRequestPageUi = (
  props: PasswordResetRequestPageProps,
) => {
  const {
    serverError,
    successMessage,
    handleForm: {
      register,
      handleSubmit,
      formState: { errors, isLoading },
    },
    onSubmit,
  } = props;

  return (
    <Container maxW="md" py={12}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <VStack gap={8} border="1px solid" p={8} borderRadius="md">
          <Heading size="lg">パスワードリセット</Heading>

          <Text fontSize="sm" color="gray.600">
            登録されているメールアドレスを入力してください。
            パスワードリセット用のリンクをお送りします。
          </Text>

          {/* サーバーエラーメッセージの表示 */}
          {serverError && (
            <Box p={4} bg="red.100" borderRadius="md" w="full">
              <Text color="red.700">{serverError}</Text>
            </Box>
          )}

          {/* 成功メッセージの表示 */}
          {successMessage && (
            <Box p={4} bg="green.100" borderRadius="md" w="full">
              <Text color="green.700">{successMessage}</Text>
            </Box>
          )}

          {/* パスワードリセットリクエストフォーム */}
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

            {/* 送信ボタン */}
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              disabled={isLoading}
            >
              リセットメールを送信
            </Button>
          </VStack>

          {/* サインインページへのリンク */}
          <Text fontSize="sm" color="gray.600">
            <ChakraLink as={Link} color="blue.500" href="/signin">
              ログインページに戻る
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};
