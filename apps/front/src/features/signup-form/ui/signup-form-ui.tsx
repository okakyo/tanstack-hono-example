import { Box } from "@chakra-ui/react";
import type { SignupFormProps } from "../model/signupFormProps";

export type SignupFormUiProps = SignupFormProps;

export const SignupFormUi = () => {
  return (
    <Box>
      <h1>Signup Form</h1>
      <form>
        <label htmlFor="username">
          Username:
          <input type="text" id="username" name="username" />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input type="password" id="password" name="password" />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </Box>
  );
};
