import { createSupabaseServerClient } from "../supabase.server";

export type LoginCredentials = {
  email: string;
  password: string;
};

export const signInWithPassword = async (credentials: LoginCredentials) => {
  const supabase = createSupabaseServerClient();
  const { data: response, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return response;
};
