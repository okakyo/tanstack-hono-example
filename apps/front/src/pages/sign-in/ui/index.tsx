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
import type { SignInPageProps } from "../model";

/**
 * サインインページのUIコンポーネント
 *
 * React Hook Form を使用して、メールアドレスとパスワードでログインするためのフォームを表示します。
 * Valibot によるバリデーションを実装し、エラーメッセージを表示します。
 * Google アカウントでのログインもサポートしています。
 *
 * @param props - SignInPageProps型のプロパティ
 */
export const SignInPageUi = (props: SignInPageProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    serverError,
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
          <Heading size="lg">ログイン</Heading>

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
                  autoComplete="current-password"
                  placeholder="パスワードを入力してください"
                  disabled={isLoading}
                />
              </InputGroup>
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* ログインボタン */}
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              disabled={isLoading}
            >
              ログイン
            </Button>
          </VStack>

          {/* パスワード忘れた場合のリンク */}
          <Text fontSize="sm" color="gray.600">
            パスワードを忘れた場合は
            <ChakraLink
              as={Link}
              color="blue.500"
              href="/password-reset-request"
            >
              こちら
            </ChakraLink>
          </Text>

          {/* サインアップページへのリンク */}
          <Text fontSize="sm" color="gray.600">
            アカウントをお持ちでない方は
            <ChakraLink as={Link} color="blue.500" href="/signup">
              こちら
            </ChakraLink>
            から登録してください
          </Text>
        </VStack>
      </form>
    </Container>
  );
};
