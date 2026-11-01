import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import {
  AuthProvider,
  ChakraUiProvider,
  TanstackQueryProvider,
} from "@/shareds/provider";
import type { RootContext } from "@/shareds/router/context";
import { InternalServerErrorComponent } from "@/shareds/router/InternalServerError";
import { NotFoundComponent } from "@/shareds/router/NotFound";
import { Toaster } from "@/shareds/ui/base-toaster";

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        lang: "ja",
      },
      {
        title: "Hono Vite Template Site",
      },
    ],
  }),
  notFoundComponent: NotFoundComponent,
  errorComponent: InternalServerErrorComponent,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <ChakraUiProvider>
          <TanstackQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackQueryProvider>
          <Toaster />
        </ChakraUiProvider>
        <Scripts />
      </body>
    </html>
  );
}
