import { QueryClient } from "@tanstack/react-query";

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

/**
 * Router と React Query で同じ QueryClient を共有します。
 */
export const getTanstackQueryContext = () => {
  if (typeof window === "undefined") {
    return {
      queryClient: createQueryClient(),
    };
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return {
    queryClient: browserQueryClient,
  };
};
