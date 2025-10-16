import type { Metadata } from "next";
import "./globals.css";
import {
  AuthProvider,
  PaymentProvider,
  ProgramProvider,
  ToastProvider,
} from "@/providers";

export const metadata: Metadata = {
  title: "Vantage",
  description: "Learning Beyond the Classroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PaymentProvider>
            <ProgramProvider>
              <ToastProvider>{children}</ToastProvider>
            </ProgramProvider>
          </PaymentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
