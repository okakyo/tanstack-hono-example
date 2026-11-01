import { createSupabaseServerClient } from "../supabase.server";
import { clearAuthCookies } from "./util";

export const signOut = async () => {
  const supabase = createSupabaseServerClient();
  const result = await supabase.auth.signOut();
  clearAuthCookies();
  return result;
};
