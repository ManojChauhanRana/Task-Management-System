import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import type { Metadata } from 'next';
import StoreProvider from '@/lib/store/StoreProvider';

export const metadata: Metadata = {
  title: 'QuantumTask | Task Management System',
  description: 'A premium, ultra-fast task management system for modern teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
