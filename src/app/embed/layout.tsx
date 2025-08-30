import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Interactive Video Player",
  description: "Embeddable interactive video player",
  robots: "noindex, nofollow", // 防止搜索引擎索引嵌入页面
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 优化iframe嵌入 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 移除默认边距和滚动条 */
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            
            /* 确保iframe内容完全填充 */
            html, body {
              height: 100%;
              width: 100%;
            }
            
            /* 隐藏滚动条但保持滚动功能 */
            ::-webkit-scrollbar {
              display: none;
            }
            
            /* 针对Firefox */
            html {
              scrollbar-width: none;
            }
          `
        }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}