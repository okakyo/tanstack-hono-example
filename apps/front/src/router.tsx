import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { getTanstackQueryContext } from "./shareds/config/tanstack-query";
import { initialRootContext } from "./shareds/router/context";
/**
 * Router インスタンスを作成
 * context は初期値として null を設定し、
 * 各ルートの beforeLoad で動的にデータを取得します
 */
export const getRouter = () => {
  const { queryClient } = getTanstackQueryContext();

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: initialRootContext,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
