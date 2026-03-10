"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, CalendarRange, User, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/components/providers/AuthProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { activeWorkout } = useAppStore();
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/plans', label: 'Planos', icon: CalendarRange },
    { href: '/workout', label: 'Treinar', icon: Dumbbell, highlight: true },
    { href: '/ranking', label: 'Ranking', icon: Trophy },
    { href: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <nav className="glass rounded-2xl flex justify-around items-center max-w-md mx-auto p-2 h-16 shadow-2xl backdrop-blur-xl bg-black/40 border-white/5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          if (link.highlight) {
             return (
               <Link 
                 key={link.href} 
                 href={link.href}
                 className="relative -top-8"
               >
                 <div className={cn(
                   "bg-gradient-to-tr from-primary to-secondary text-white p-4 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all active:scale-95 flex flex-col items-center justify-center border-4 border-background",
                   activeWorkout && "animate-pulse ring-4 ring-primary/30"
                 )}>
                   {activeWorkout ? <Play className="h-7 w-7 fill-current" /> : <Dumbbell className="h-7 w-7" />}
                 </div>
               </Link>
             )
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
