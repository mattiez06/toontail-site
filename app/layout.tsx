export const metadata = {
  title: "ToonTail — Turn wake into wow",
  description: "A tunable bolt-on rooster tail for pontoons & tritoons.",
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header with logo + social links */}
        <header className="border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo / Title */}
            <a href="/" className="flex items-center gap-3">
              <img
                src="/media/ToonTail_Logo.jpeg?v=8"
                alt="ToonTail"
                className="h-8 w-8"
              />
              <span className="font-bold tracking-wide">ToonTail</span>
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/ToonTail_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ToonTail on Instagram"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                  alt="Instagram"
                  className="h-6 w-6"
                />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@ToonTail"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ToonTail on YouTube"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg"
                  alt="YouTube"
                  className="h-6 w-6"
                />
              </a>

              {/* Facebook (placeholder, greyed out) */}
              <span
                className="opacity-40 cursor-not-allowed"
                title="Facebook (coming soon)"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                  alt="Facebook"
                  className="h-6 w-6"
                />
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
