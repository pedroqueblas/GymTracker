"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Scale, Trophy, Droplets, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from "recharts";
import { format } from "date-fns";
import { EXERCISES, MUSCLE_LABELS } from "@/data/exercises";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { 
    workoutHistory, 
    hydration, 
    bodyWeight, 
    addBodyWeight 
  } = useAppStore();
  
  const [newWeight, setNewWeight] = useState("");
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);

  const handleUpdateWeight = () => {
    if (newWeight) {
      addBodyWeight(Number(newWeight));
      setIsWeightDialogOpen(false);
      setNewWeight("");
    }
  };

  const currentWeight = bodyWeight && bodyWeight.length > 0 ? bodyWeight[bodyWeight.length - 1].weight : 0;
  const startWeight = bodyWeight && bodyWeight.length > 0 ? bodyWeight[0].weight : 0;
  const weightDiff = currentWeight - startWeight;

  // Prepare chart data
  const weightData = bodyWeight?.map(log => ({
    date: format(new Date(log.date), 'dd/MM'),
    weight: log.weight
  })).slice(-10) || []; // Last 10 entries

  // Muscle frequency
  const muscleCount: Record<string, number> = {};
  
  workoutHistory?.forEach(session => {
    session.exercises?.forEach(ex => {
      // Find exercise to get target
      const exerciseDef = EXERCISES.find(e => e.id === ex.exerciseId);
      if (exerciseDef) {
        const muscle = exerciseDef.muscleGroup;
        // Count total sets as volume metric
        const setsCount = ex.sets?.filter(s => s.completed)?.length || 0;
        if (setsCount > 0) {
          muscleCount[muscle] = (muscleCount[muscle] || 0) + setsCount;
        }
      }
    });
  });
  
  // Convert to array for chart
  const muscleData = Object.entries(muscleCount)
    .map(([key, value]) => ({
      name: MUSCLE_LABELS[key] || key,
      value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 muscles

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-70"></div>
            <Avatar className="h-16 w-16 border-2 border-background relative">
              <AvatarImage src={user?.photoURL || "/avatars/default.png"} />
              <AvatarFallback>{user?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName}</h1>
            <p className="text-muted-foreground text-sm">Membro desde {new Date().getFullYear()}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
          <LogOut className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Trophy className="h-8 w-8 text-accent mb-2" />
            <span className="text-2xl font-bold">{workoutHistory?.length || 0}</span>
            <span className="text-xs text-muted-foreground">Treinos Concluídos</span>
          </GlassCard>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Droplets className="h-8 w-8 text-secondary mb-2" />
            <span className="text-2xl font-bold">{hydration.history?.length || 0}</span>
            <span className="text-xs text-muted-foreground">Dias Meta Batida</span>
          </GlassCard>
        </motion.div>
      </div>

      {/* Weight Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" /> Peso Corporal
              </h3>
              <p className="text-sm text-muted-foreground">
                Atual: <span className="text-foreground font-bold">{currentWeight}kg</span>
                {weightDiff !== 0 && (
                  <span className={weightDiff > 0 ? "text-destructive ml-2" : "text-accent ml-2"}>
                    ({weightDiff > 0 ? "+" : ""}{weightDiff.toFixed(1)})
                  </span>
                )}
              </p>
            </div>
            
            <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                  Atualizar
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Atualizar Peso</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="col-span-3 bg-background/50"
                      placeholder="Ex: 75.5"
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateWeight} className="w-full bg-gradient-to-r from-primary to-secondary">
                  Salvar
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  dot={{ fill: 'var(--background)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--secondary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Activity Chart (Placeholder for now) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" /> Frequência Muscular
          </h3>
          <div className="h-[200px] w-full flex items-center justify-center">
             {muscleData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="var(--secondary)" />
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                 <div className="p-3 rounded-full bg-white/5">
                   <TrendingUp className="h-6 w-6 text-muted-foreground/50" />
                 </div>
                 <p className="text-sm">Realize treinos para ver suas estatísticas</p>
               </div>
             )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
