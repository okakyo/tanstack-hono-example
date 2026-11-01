import { useSignUpPageHooks } from "./hooks";
import { SignUpPageUi } from "./ui";

export const SignUpPage = () => {
  const props = useSignUpPageHooks();
  return <SignUpPageUi {...props} />;
};
