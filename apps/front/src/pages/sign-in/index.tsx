import { useSignInPageHooks } from "./api";
import { SignInPageUi } from "./ui";

export const SignInPage = () => {
  const props = useSignInPageHooks();
  return <SignInPageUi {...props} />;
};
