"use client";

import { useAppStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Trophy, Play, Droplets, Plus, Minus, Settings, ChevronRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { 
    activeWorkout, 
    workoutHistory, 
    hydration, 
    addWater, 
    setHydrationGoal,
    checkHydrationDate 
  } = useAppStore();
  
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  useEffect(() => {
    checkHydrationDate();
  }, [checkHydrationDate]);

  const workoutsThisWeek = workoutHistory.filter(w => {
    const date = new Date(w.date);
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    return date > oneWeekAgo;
  }).length;

  const hydrationPercentage = Math.min(100, (hydration.current / hydration.goal) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      <motion.header variants={item} className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Olá, Atleta 👋
          </h1>
          <p className="text-muted-foreground">Vamos superar os limites hoje?</p>
        </div>
      </motion.header>

      {/* Active Workout Banner */}
      {activeWorkout && (
        <motion.div variants={item}>
          <Link href="/workout">
            <GlassCard className="relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/20 to-secondary/20 group">
              <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500 animate-pulse" /> Treino em Andamento
                  </h3>
                  <p className="text-sm text-white/70">Continue de onde parou</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={item}>
          <GlassCard className="p-4 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Dumbbell className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Treinos Semana</p>
              <h4 className="text-4xl font-bold text-white mt-1">{workoutsThisWeek}</h4>
            </div>
            <div className="relative z-10 text-xs text-primary font-medium flex items-center">
              +1 essa semana
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-4 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Trophy className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Treinos</p>
              <h4 className="text-4xl font-bold text-white mt-1">{workoutHistory.length}</h4>
            </div>
            <div className="relative z-10 text-xs text-secondary font-medium flex items-center">
              Continue assim!
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Hydration Widget */}
      <motion.div variants={item}>
        <GlassCard className="border-blue-500/30 bg-blue-500/10 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-100">Hidratação</h3>
                  <p className="text-xs text-blue-200/70">{hydration.current}ml de {hydration.goal}ml</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-blue-200 hover:text-white hover:bg-blue-500/20" 
                onClick={() => setIsEditingGoal(!isEditingGoal)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {isEditingGoal && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-between bg-black/20 p-2 rounded-lg mb-3 border border-white/5"
              >
                <span className="text-sm font-medium">Meta: {hydration.goal}ml</span>
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-7 w-7 border-white/10 hover:bg-white/10" 
                    onClick={() => setHydrationGoal(Math.max(1000, hydration.goal - 250))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-7 w-7 border-white/10 hover:bg-white/10" 
                    onClick={() => setHydrationGoal(hydration.goal + 250)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="relative h-4 bg-black/30 rounded-full overflow-hidden mb-4 border border-white/5">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${hydrationPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border border-blue-500/30"
                onClick={() => addWater(250)}
              >
                +250ml
              </Button>
              <Button 
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border border-blue-500/30"
                onClick={() => addWater(500)}
              >
                +500ml
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/workout">
            <GlassCard className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
                <div>
                  <h4 className="font-semibold">Iniciar Treino</h4>
                  <p className="text-xs text-muted-foreground">Começar sessão agora</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
            </GlassCard>
          </Link>
          
          <Link href="/history">
            <GlassCard className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Histórico</h4>
                  <p className="text-xs text-muted-foreground">Ver treinos concluídos</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
            </GlassCard>
          </Link>

          <Link href="/plans">
            <GlassCard className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Criar Plano</h4>
                  <p className="text-xs text-muted-foreground">Personalize sua rotina</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
            </GlassCard>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
