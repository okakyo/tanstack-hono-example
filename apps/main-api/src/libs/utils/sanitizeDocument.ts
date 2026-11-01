/**
 * Tiptap の StarterKit で生成される HTML だけを保存できるようにする。
 * 属性を一切保存しないため、イベントハンドラや javascript: URL も残らない。
 */
const allowedTags = new Set([
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "strike",
]);

const dangerousElementPattern =
  /<\s*(script|style|iframe|object|embed|svg|math|template)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|style|iframe|object|embed|svg|math|template)\b[^>]*\/?\s*>/gi;

/**
 * HTML の書式は許可リストにあるタグだけを残し、すべての属性を破棄する。
 * API 境界で実行することで、エディタを経由しないリクエストも保護する。
 */
export const sanitizeDocumentContent = (content: string): string =>
  content
    .replace(dangerousElementPattern, "")
    .replace(/<\s*(\/?)\s*([a-z][a-z0-9]*)\b[^>]*>/gi, (_match, slash, tag) => {
      const normalizedTag = tag.toLowerCase();

      if (!allowedTags.has(normalizedTag)) {
        return "";
      }

      if (slash) {
        return `</${normalizedTag}>`;
      }

      return `<${normalizedTag}>`;
    });

/** HTML を受け付けない入力欄用に、残ったタグも除去する。 */
export const sanitizeDocumentText = (value: string): string =>
  sanitizeDocumentContent(value).replace(
    /<\s*\/?\s*[a-z][a-z0-9]*\b[^>]*>/gi,
    "",
  );
