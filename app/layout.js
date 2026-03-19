import "./global.css";

export const metadata = {
  title: "FitCoach AI",
  description: "AI Fitness Coach App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
