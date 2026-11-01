import { QueryClientProvider } from "@tanstack/react-query";
import { getTanstackQueryContext } from "@/shareds/config";

export const TanstackQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { queryClient } = getTanstackQueryContext();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
