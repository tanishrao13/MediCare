import "./globals.css";

export const metadata = {
  title: "MediCare",
  description: "Healthcare Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
