import { useForm } from "react-hook-form";

export const useSignupFormProps = () => {
  const { register, handleSubmit } = useForm();
  return {
    handleSubmit,
    register,
  };
};
