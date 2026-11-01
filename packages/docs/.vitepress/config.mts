import {defineConfig} from "vitepress";

export default defineConfig({
  title: "Vite Hono Template Docs",
  description: "Vite Hono Template の開発ドキュメント",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'オンボーディング', link: '/docs/on-boarding' },
      { text: '開発ルール', link: '/docs/rules/' },
      { text: '設計', link: '/docs/designs/' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'オンボーディング', link: '/docs/on-boarding' },
        ]
      },
      {
        text: '開発ルール',
        items: [
          { text: '概要', link: '/docs/rules/' },
          { text: 'TypeScript コーディングルール', link: '/docs/rules/typescript' },
          { text: 'フロントエンド', link: '/docs/rules/frontend' },
          { text: 'バックエンド', link: '/docs/rules/backend' },
          { text: '認証機能', link: '/docs/rules/authentication' },
          { text: 'パッケージ管理', link: '/docs/rules/packages' },
          { text: 'コードレビュー', link: '/docs/rules/code-review' },
          { text: 'Git ワークフロー', link: '/docs/rules/git-workflow' },
        ]
      },
      {
        text: '設計',
        items: [
          { text: '概要', link: '/docs/designs/' },
          { text: 'アーキテクチャ', link: '/docs/designs/architecture' },
          { text: 'データベース設計', link: '/docs/designs/database' },
          { text: 'API 設計', link: '/docs/designs/api-design' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/okakyo/vite-hono-template' }
    ]
  },
})
