// app/layout.js
export const metadata = {
  title: "Carbon Bazzar",
  description: "Your carbon trading marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>🌍 Carbon Bazzar</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
