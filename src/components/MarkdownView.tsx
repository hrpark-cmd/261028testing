// 마크다운 + 수식($...$, $$...$$)을 화면에 표시합니다.
// 보안: 원시 HTML 은 렌더링하지 않습니다(skipHtml, rehype-raw 미사용) → 사용자가 쓴 글로 인한 XSS 방지.
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function MarkdownView({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`markdown ${className}`}>
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}
        components={{
          // 본문 속 링크는 새 탭에서 열기
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
