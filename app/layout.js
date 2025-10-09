import "./globals.css";
import Providers from "./providers";


export const metadata = {
  title: "Carbon Bazzar",
  description: "Next.js Project with Authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
