import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { BottomNav } from '@/components/BottomNav';
import SyncSimulator from '@/components/providers/SyncSimulator';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Project 325k',
  description: 'The official companion webapp for a smart refillable transdermal nutrient delivery patch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-slate-100 selection:bg-purple-500/30`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SyncSimulator />
          <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Liquid Glass Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-[100px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-teal-500/20 to-cyan-500/20 blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[100px] opacity-30 pointer-events-none" />
            
            <main className="relative flex flex-col min-h-screen pb-24 z-10">
              {children}
            </main>
            <BottomNav />
            <Toaster 
              position="top-center" 
              toastOptions={{
                className: 'bg-white/10 backdrop-blur-2xl border border-white/20 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-2xl',
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
