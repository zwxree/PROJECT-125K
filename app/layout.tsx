import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { BottomNav } from '@/components/BottomNav';
import SyncSimulator from '@/components/providers/SyncSimulator';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Project 125k',
  description: 'The official companion webapp for a smart refillable transdermal nutrient delivery patch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#F4EBE6] text-[#1A1A1A] selection:bg-[#A78BFA]/30`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SyncSimulator />
          <div className="relative min-h-screen overflow-hidden bg-[#F4EBE6]">
            {/* Liquid Glass Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#FFB88C] to-[#DE6262] blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#84FAB0] to-[#8FD3F4] blur-[120px] opacity-50 pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[#A78BFA] to-[#F472B6] blur-[100px] opacity-40 pointer-events-none" />
            
            <main className="relative flex flex-col min-h-screen pb-24 z-10">
              {children}
            </main>
            <BottomNav />
            <Toaster 
              position="top-center" 
              toastOptions={{
                className: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl rounded-2xl',
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
