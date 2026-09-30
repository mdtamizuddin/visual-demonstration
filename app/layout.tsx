import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Autonomous AI Coding IDE',
  description: 'Visual simulation of an autonomous AI developer actively coding, refactoring, and running tests in VS Code.',
  openGraph: {
    title: 'Autonomous AI Coding IDE',
    description: 'Visual simulation of an autonomous AI developer actively coding, refactoring, and running tests in VS Code.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autonomous AI Coding IDE',
    description: 'Visual simulation of an autonomous AI developer actively coding, refactoring, and running tests in VS Code.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
