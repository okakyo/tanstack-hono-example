import {
  Box,
  Center,
  createListCollection,
  Field,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  createMemberRequestSchema,
  memberRoleEntitySchema,
} from "@repo/main-api/schema";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { BaseButton } from "@/shareds/ui/base-button";
import { BaseInput } from "@/shareds/ui/base-input";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/shareds/ui/base-select";

const memberFormSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "名前を入力してください。")),
  email: createMemberRequestSchema.entries.email,
  memberRoleId: v.pipe(
    v.string(),
    v.minLength(1, "ロールを選択してください。"),
  ),
});

/** ロール選択肢。API のロール一覧の一部を使う。 */
const memberRoleOptionSchema = v.pick(memberRoleEntitySchema, ["id", "role"]);

export type MemberFormData = v.InferOutput<typeof memberFormSchema>;
export type MemberRoleOption = v.InferOutput<typeof memberRoleOptionSchema>;

export type MemberFormProps = {
  title: string;
  submitText: string;
  defaultValues?: MemberFormData;
  roles: MemberRoleOption[];
  isLoading: boolean;
  readOnly?: boolean;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
};

/**
 * メンバー作成・編集フォームを表示します。
 */
export const MemberForm = (props: MemberFormProps) => {
  const formHandler = useForm<MemberFormData>({
    resolver: valibotResolver<MemberFormData, unknown, MemberFormData>(
      memberFormSchema,
    ),
    defaultValues: {
      name: props.defaultValues?.name ?? "",
      email: props.defaultValues?.email ?? "",
      memberRoleId: props.defaultValues?.memberRoleId ?? "",
    },
    values: {
      name: props.defaultValues?.name ?? "",
      email: props.defaultValues?.email ?? "",
      memberRoleId: props.defaultValues?.memberRoleId ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formHandler;

  const selectedRoleId = watch("memberRoleId");

  const roleCollection = createListCollection({
    items: props.roles.map((role) => ({
      label: role.role,
      value: role.id,
    })),
  });

  if (props.isLoading) {
    return (
      <Center height="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Text fontSize="3xl" fontWeight="bold" mb={8}>
        {props.title}
      </Text>

      <form
        noValidate
        onSubmit={
          props.readOnly
            ? (event) => event.preventDefault()
            : handleSubmit(async (data) => {
                await props.onSubmit(data);
              })
        }
      >
        <Stack gap={6} maxWidth="2xl">
          <Field.Root required invalid={!!errors.name}>
            <Field.Label htmlFor="member-name">
              名前
              <Field.RequiredIndicator />
            </Field.Label>
            <BaseInput
              id="member-name"
              readOnly={props.readOnly}
              {...register("name")}
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.email}>
            <Field.Label htmlFor="member-email">
              メールアドレス
              <Field.RequiredIndicator />
            </Field.Label>
            <BaseInput
              id="member-email"
              readOnly={props.readOnly}
              {...register("email")}
              type="email"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.memberRoleId}>
            <Field.Label htmlFor="member-role">
              ロール名
              <Field.RequiredIndicator />
            </Field.Label>
            <SelectRoot
              id="member-role"
              collection={roleCollection}
              disabled={props.readOnly}
              value={selectedRoleId ? [selectedRoleId] : []}
              onValueChange={(details: { value: string[] }) => {
                const value = details.value[0] ?? "";
                setValue("memberRoleId", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="ロールを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {roleCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            <Field.ErrorText>{errors.memberRoleId?.message}</Field.ErrorText>
          </Field.Root>

          <Stack direction="row" justify="flex-end" gap={4}>
            <BaseButton
              size="xl"
              type="button"
              variant="ghost"
              onClick={props.onCancel}
              disabled={props.isLoading}
            >
              キャンセル
            </BaseButton>
            {!props.readOnly && (
              <BaseButton
                size="xl"
                width="120px"
                type="submit"
                loading={props.isLoading}
              >
                {props.submitText}
              </BaseButton>
            )}
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
