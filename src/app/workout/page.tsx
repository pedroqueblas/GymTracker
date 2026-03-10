"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExerciseSelector } from "@/components/workout/ExerciseSelector";
import { ExerciseLoggerCard } from "@/components/workout/ExerciseLoggerCard";
import { RestTimer } from "@/components/workout/RestTimer";
import { CardioLogger } from "@/components/workout/CardioLogger";
import { Exercise } from "@/types";
import { Save, XCircle, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { WORKOUT_PLANS } from "@/data/plans";

export default function WorkoutPage() {
  const router = useRouter();
  const { 
    activeWorkout, 
    startWorkout, 
    finishWorkout, 
    cancelWorkout,
    addExerciseLog,
    updateExerciseLog,
    customPlans // Added customPlans from store
  } = useAppStore();
  
  const [customName, setCustomName] = useState("");

  const allPlans = [...WORKOUT_PLANS, ...customPlans];

  const handleStart = (name: string) => {
    startWorkout(name);
  };

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseLog({
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      sets: [
        { weight: 0, reps: 0, completed: false }
      ]
    });
  };

  const handleFinish = () => {
    finishWorkout();
    router.push('/');
  };

  // --- TELA DE SELEÇÃO DE TREINO (Se não houver ativo) ---
  if (!activeWorkout) {
    return (
      <div className="space-y-6 pb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Iniciar Treino</h1>
          <p className="text-muted-foreground">O que vamos treinar hoje?</p>
        </div>

        {/* Quick Start */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Treino Livre</CardTitle>
            <CardDescription>Monte seu treino na hora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              placeholder="Nome do treino (Opcional)" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Button className="w-full font-bold" onClick={() => handleStart(customName || "Treino Livre")}>
              <Play className="h-4 w-4 mr-2" /> Começar Agora
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Seus Planos de Treino</h2>
          {allPlans.map(plan => (
            <div key={plan.id} className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{plan.name}</h3>
              {plan.split.map((day, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  className="w-full justify-between h-auto py-3"
                  onClick={() => handleStart(`${plan.name} - ${day.day}`)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {day.muscleGroups.join(', ')}
                    </span>
                  </div>
                  <Play className="h-4 w-4 text-primary" />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TELA DE TREINO EM ANDAMENTO ---
  return (
    <div className="space-y-6 pb-40">
      <RestTimer />
      
      <header className="sticky top-0 bg-background/95 backdrop-blur z-10 py-2 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{activeWorkout.name}</h1>
            <p className="text-xs text-muted-foreground">Em andamento • {activeWorkout.exercises.length} exercícios</p>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => {
            if(confirm("Deseja realmente cancelar este treino?")) cancelWorkout();
          }}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="space-y-4">
        <CardioLogger />
        
        {activeWorkout.exercises.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
            <p>Nenhum exercício adicionado.</p>
            <p className="text-sm">Toque abaixo para começar.</p>
          </div>
        ) : (
          activeWorkout.exercises.map((log) => (
            <ExerciseLoggerCard 
              key={log.id} 
              log={log} 
              onUpdate={(sets) => updateExerciseLog(log.id, sets)}
            />
          ))
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex flex-col gap-3 pointer-events-auto">
          <ExerciseSelector onSelect={handleAddExercise} />
          
          <Button 
            size="lg" 
            className="w-full font-bold shadow-xl" 
            onClick={handleFinish}
            disabled={activeWorkout.exercises.length === 0}
          >
            <Save className="h-4 w-4 mr-2" /> Finalizar Treino
          </Button>
        </div>
      </div>
    </div>
  );
}
