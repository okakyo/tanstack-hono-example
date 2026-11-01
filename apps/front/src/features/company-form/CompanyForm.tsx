import { Box, Center, Field, Spinner, Stack, Text } from "@chakra-ui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { createCompanyDtoSchema } from "@repo/main-api/schema";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { BaseButton } from "@/shareds/ui/base-button";
import { Checkbox } from "@/shareds/ui/base-checkbox";
import { BaseInput } from "@/shareds/ui/base-input";

const companyFormSchema = v.pick(createCompanyDtoSchema, [
  "name",
  "isSupplier",
  "phone",
  "address",
]);

export type CompanyFormData = v.InferOutput<typeof companyFormSchema>;

export type CompanyFormProps = {
  title: string;
  submitText: string;
  defaultValues?: CompanyFormData;
  isLoading: boolean;
  readOnly?: boolean;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
};

/**
 * 企業作成・編集フォームを表示します。
 */
export const CompanyForm = (props: CompanyFormProps) => {
  const formHandler = useForm<CompanyFormData>({
    resolver: valibotResolver(companyFormSchema),
    defaultValues: {
      name: props.defaultValues?.name ?? "",
      isSupplier: props.defaultValues?.isSupplier ?? false,
      phone: props.defaultValues?.phone ?? "",
      address: props.defaultValues?.address ?? "",
    },
    values: {
      name: props.defaultValues?.name ?? "",
      isSupplier: props.defaultValues?.isSupplier ?? false,
      phone: props.defaultValues?.phone ?? "",
      address: props.defaultValues?.address ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formHandler;

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
            <Field.Label htmlFor="company-name">
              企業名
              <Field.RequiredIndicator />
            </Field.Label>
            <BaseInput
              id="company-name"
              readOnly={props.readOnly}
              {...register("name")}
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Checkbox
              checked={watch("isSupplier") ?? false}
              disabled={props.readOnly}
              onCheckedChange={(details: {
                checked: boolean | "indeterminate";
              }) => {
                setValue("isSupplier", details.checked === true, {
                  shouldValidate: true,
                });
              }}
            >
              仕入先企業として登録する
            </Checkbox>
          </Field.Root>

          <Field.Root invalid={!!errors.phone}>
            <Field.Label htmlFor="company-phone">電話番号（任意）</Field.Label>
            <BaseInput
              id="company-phone"
              readOnly={props.readOnly}
              {...register("phone")}
            />
            <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.address}>
            <Field.Label htmlFor="company-address">住所（任意）</Field.Label>
            <BaseInput
              id="company-address"
              readOnly={props.readOnly}
              {...register("address")}
            />
            <Field.ErrorText>{errors.address?.message}</Field.ErrorText>
          </Field.Root>

          <Stack direction="row" justify="flex-end" gap={4}>
            <BaseButton
              size="xl"
              width="120px"
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
