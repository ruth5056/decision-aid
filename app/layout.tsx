// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "決策輔助工具",
  description: "Web-based decision aid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
