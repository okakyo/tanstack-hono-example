import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Field,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { PasswordResetPageProps } from "../model";

/**
 * パスワードリセットページのUIコンポーネント
 *
 * 新しいパスワードと確認用パスワードを入力してパスワードを更新するフォームを表示します。
 * React Hook Form を使用し、Valibot によるバリデーションを実装しています。
 *
 * @param props - PasswordResetPageProps型のプロパティ
 */
export const PasswordResetPageUi = (props: PasswordResetPageProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    serverError,
    successMessage,
    isVerifying,
    verifyError,
    handleForm: {
      register,
      handleSubmit,
      formState: { errors, isLoading },
    },
    onSubmit,
  } = props;

  // コード検証中の表示
  if (isVerifying) {
    return (
      <Container maxW="md" py={12}>
        <Flex
          minHeight="400px"
          justify="center"
          align="center"
          direction="column"
          gap={4}
        >
          <Spinner width="48px" height="48px" color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            リセットリンクを確認しています...
          </Text>
        </Flex>
      </Container>
    );
  }

  // コード検証エラーの表示
  if (verifyError) {
    return (
      <Container maxW="md" py={12}>
        <VStack
          gap={6}
          border="1px solid"
          borderColor="red.200"
          p={8}
          borderRadius="md"
        >
          <Heading size="lg" color="red.600">
            エラー
          </Heading>
          <Box p={4} bg="red.100" borderRadius="md" w="full">
            <Text color="red.700">{verifyError}</Text>
          </Box>
          <Text fontSize="sm" color="gray.600">
            数秒後にログインページに移動します...
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={12}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <VStack gap={8} border="1px solid" p={8} borderRadius="md">
          <Heading size="lg">新しいパスワードの設定</Heading>

          <Text fontSize="sm" color="gray.600">
            新しいパスワードを入力してください。
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

          {/* パスワードリセットフォーム */}
          <VStack gap={4} width="100%">
            {/* 新しいパスワード入力 */}
            <Field.Root invalid={!!errors.password} width="100%">
              <Field.Label htmlFor="password">新しいパスワード</Field.Label>
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
                    disabled={isLoading || !!successMessage}
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
                  placeholder="8文字以上のパスワードを入力してください"
                  disabled={isLoading || !!successMessage}
                />
              </InputGroup>
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* 確認用パスワード入力 */}
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
                    disabled={isLoading || !!successMessage}
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
                  placeholder="確認のため再度入力してください"
                  disabled={isLoading || !!successMessage}
                />
              </InputGroup>
              {errors.confirmPassword && (
                <Field.ErrorText>
                  {errors.confirmPassword.message}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* 更新ボタン */}
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              disabled={isLoading || !!successMessage}
            >
              パスワードを更新
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
