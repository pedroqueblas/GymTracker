"use client";

import { ExerciseLog } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Check, RotateCcw, Dumbbell, Repeat } from "lucide-react";
import { EXERCISES } from "@/data/exercises";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { motion } from "framer-motion";

interface ExerciseLoggerCardProps {
  log: ExerciseLog;
  onUpdate: (sets: { weight: number; reps: number; completed: boolean }[]) => void;
  onRemove?: () => void;
}

export function ExerciseLoggerCard({ log, onUpdate, onRemove }: ExerciseLoggerCardProps) {
  const { startRestTimer } = useAppStore();
  const exerciseDef = EXERCISES.find(e => e.id === log.exerciseId);
  
  const activeSetIndex = log.sets.findIndex(s => !s.completed);
  const isAllCompleted = activeSetIndex === -1;
  const currentSetIndex = isAllCompleted ? log.sets.length : activeSetIndex;

  const handleFinishSet = (weight: number, reps: number) => {
    if (weight === 0 && reps === 0) return;
    const newSets = [...log.sets];
    if (currentSetIndex < newSets.length) {
      newSets[currentSetIndex] = { ...newSets[currentSetIndex], weight, reps, completed: true };
    } else {
      newSets.push({ weight, reps, completed: true });
    }
    onUpdate(newSets);
    startRestTimer(120);
  };

  const handleUpdateCompletedSet = (index: number, field: 'weight' | 'reps', value: string) => {
    const newSets = [...log.sets];
    const numValue = parseFloat(value) || 0;
    newSets[index] = { ...newSets[index], [field]: numValue };
    onUpdate(newSets);
  };

  const toggleSetIncomplete = (index: number) => {
    const newSets = [...log.sets];
    newSets[index] = { ...newSets[index], completed: false };
    onUpdate(newSets);
  };

  const addNextSet = () => {
    const lastSet = log.sets[log.sets.length - 1] || { weight: 0, reps: 0 };
    onUpdate([...log.sets, { ...lastSet, completed: false }]);
  };

  if (!exerciseDef) return null;

  return (
    <GlassCard className={cn(
      "p-0 overflow-hidden transition-all duration-300", 
      isAllCompleted ? "border-green-500/30 bg-green-500/5" : "border-primary/30"
    )}>
      <div className="p-4 flex flex-row items-center justify-between border-b border-white/5 bg-black/20">
        <div className="flex-1">
          <h3 className="text-lg font-bold leading-tight flex items-center gap-2">
            {exerciseDef.name}
            {isAllCompleted && <Check className="h-5 w-5 text-green-500" />}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{exerciseDef.muscleGroup}</p>
        </div>
        {onRemove && (
          <Button variant="ghost" size="icon" onClick={onRemove} className="text-muted-foreground hover:text-destructive h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Previous Completed Sets */}
        <div className="space-y-2">
          {log.sets.map((set, index) => {
            if (!set.completed) return null; // Skip active set here
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm bg-black/20 p-2 rounded-lg border border-white/5"
              >
                <div className="w-8 font-mono text-muted-foreground text-center">#{index + 1}</div>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 flex items-center gap-1">
                     <span className="text-muted-foreground">Kg:</span>
                     <Input 
                        className="h-6 w-16 p-1 text-center bg-transparent border-none focus:ring-1 focus:bg-black/40" 
                        value={set.weight}
                        onChange={(e) => handleUpdateCompletedSet(index, 'weight', e.target.value)}
                        type="number"
                      />
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                     <span className="text-muted-foreground">Reps:</span>
                     <Input 
                        className="h-6 w-16 p-1 text-center bg-transparent border-none focus:ring-1 focus:bg-black/40" 
                        value={set.reps}
                        onChange={(e) => handleUpdateCompletedSet(index, 'reps', e.target.value)}
                        type="number"
                      />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={() => toggleSetIncomplete(index)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </motion.div>
            );
          })}
        </div>

        {!isAllCompleted && (
          <ActiveSetInput
            key={`${log.id}-${currentSetIndex}`}
            currentSetNumber={currentSetIndex + 1}
            initialWeight={log.sets[currentSetIndex]?.weight ?? 0}
            initialReps={log.sets[currentSetIndex]?.reps ?? 0}
            onFinish={handleFinishSet}
          />
        )}

        {/* Next Sets Preview or Add Button */}
        {isAllCompleted ? (
           <Button variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5" onClick={addNextSet}>
             <Plus className="mr-2 h-4 w-4" /> Adicionar Série Extra
           </Button>
        ) : (
          <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
            <span>Próximas: {log.sets.length - 1 - currentSetIndex} séries restantes</span>
            {log.sets.length > currentSetIndex + 1 && (
               <div className="flex gap-1">
                 {log.sets.slice(currentSetIndex + 1).map((_, i) => (
                   <div key={i} className="w-2 h-2 rounded-full bg-white/10"></div>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function ActiveSetInput({
  currentSetNumber,
  initialWeight,
  initialReps,
  onFinish
}: {
  currentSetNumber: number;
  initialWeight: number;
  initialReps: number;
  onFinish: (weight: number, reps: number) => void;
}) {
  const [weightInput, setWeightInput] = useState(initialWeight > 0 ? String(initialWeight) : "");
  const [repsInput, setRepsInput] = useState(initialReps > 0 ? String(initialReps) : "");

  const handleFinish = () => {
    const weight = parseFloat(weightInput) || 0;
    const reps = parseFloat(repsInput) || 0;
    onFinish(weight, reps);
  };

  return (
    <motion.div 
      layout
      className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
    >
      <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
        Série {currentSetNumber}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
        <div className="space-y-1">
          <label className="text-xs text-primary font-semibold flex items-center gap-1">
            <Dumbbell className="h-3 w-3" /> Carga (kg)
          </label>
          <Input 
            type="number" 
            placeholder="0" 
            className="h-14 text-2xl text-center font-bold bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            autoFocus
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-secondary font-semibold flex items-center gap-1">
            <Repeat className="h-3 w-3" /> Repetições
          </label>
          <Input 
            type="number" 
            placeholder="0" 
            className="h-14 text-2xl text-center font-bold bg-background/50 border-secondary/20 focus:border-secondary focus:ring-secondary/20"
            value={repsInput}
            onChange={(e) => setRepsInput(e.target.value)}
          />
        </div>
      </div>

      <Button 
        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
        onClick={handleFinish}
      >
        CONCLUIR SÉRIE <Check className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
}
