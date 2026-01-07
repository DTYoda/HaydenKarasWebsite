import "./globals.css";

export const metadata = {
  title: "Hayden Karas",
  description:
    "The homepage for Hayden Karas, a software engineer from Cranston, Rhode Island.",
  icons: {
    icon: "/icon.png", // /public path
  },
  themeColor: "black",
  other: {
    colorScheme: "dark", // Adds <meta name="color-scheme" content="dark">
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen h-fit w-full m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
