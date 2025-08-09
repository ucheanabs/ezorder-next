export const metadata = {
  title: "EZOrder · Scan · Order · Enjoy",
  description: "QR code ordering with table-specific delivery and real-time tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}