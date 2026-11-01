import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { ProfilePageUiProps } from "../model";

/**
 * 読み取り専用のフォームフィールドコンポーネント
 *
 * @param label - フィールドのラベル
 * @param value - フィールドの値
 */
const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <Field.Root readOnly>
    <Field.Label>{label}</Field.Label>
    <Input value={value} readOnly bg="gray.50" />
  </Field.Root>
);

/**
 * プロフィールページのUIコンポーネント
 * ログインユーザーの情報を編集・表示します
 *
 * @param props - プロフィールデータ、ローディング状態、エラー、フォーム機能
 */
export const ProfilePageUi = (props: ProfilePageUiProps) => {
  const {
    profileData,
    isLoading,
    error,
    currentTenant,
    formData,
    setFormData,
    onSubmit,
    isUpdating,
  } = props;

  // ローディング中の表示
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // エラーの表示
  if (error) {
    return (
      <Box p={8}>
        <Text color="red.500" fontSize="lg">
          エラーが発生しました: {error.message}
        </Text>
      </Box>
    );
  }

  // データがない場合の表示
  if (!profileData) {
    return (
      <Box p={8}>
        <Text fontSize="lg">プロフィール情報が見つかりませんでした。</Text>
      </Box>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={8}>
      <Heading as="h1" size="2xl" mb={8}>
        プロフィール
      </Heading>

      <form onSubmit={onSubmit}>
        {/* 基本情報セクション */}
        <Card.Root mb={6}>
          <Card.Header>
            <Heading as="h2" size="lg">
              基本情報
            </Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>
                  ユーザー名
                  <Field.RequiredIndicator fontSize="xl" />
                </Field.Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ユーザー名を入力"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>
                  メールアドレス
                  <Field.RequiredIndicator fontSize="xl" />
                </Field.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="メールアドレスを入力"
                />
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              fontWeight="bold"
              loading={isUpdating}
              disabled={isUpdating}
            >
              {isUpdating ? "更新中..." : "プロフィールを更新"}
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>

      {/* 現在の所属テナント情報 */}
      <Card.Root mb={6}>
        <Card.Header>
          <Heading as="h2" size="lg">
            現在の所属テナント
          </Heading>
          <Text fontSize="sm" color="gray.600" mt={2}>
            ※ テナント情報は変更できません
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <ReadOnlyField
              label="テナント名"
              value={currentTenant.tenantName ?? "-"}
            />
            <ReadOnlyField
              label="会社名"
              value={currentTenant.companyName ?? "-"}
            />
            <ReadOnlyField
              label="チーム権限"
              value={currentTenant.memberRole ?? "-"}
            />
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* 所属テナント情報セクション（読み取り専用） */}
      <Card.Root mb={6}>
        <Card.Header>
          <Heading as="h2" size="lg">
            その他
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <Button
              maxWidth="240px"
              variant="outline"
              colorPalette="gray"
              fontWeight="bold"
            >
              パスワードの変更
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Button
        maxWidth="240px"
        variant="outline"
        colorPalette="red"
        fontWeight="bold"
      >
        退会する
      </Button>
    </Box>
  );
};
