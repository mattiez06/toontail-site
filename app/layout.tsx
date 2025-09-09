export const metadata = {
  title: "ToonTail — Turn wake into wow",
  description: "A tunable bolt-on rooster tail for pontoons & tritoons.",
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
