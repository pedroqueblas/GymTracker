"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { MUSCLE_LABELS } from "@/data/exercises";
import { useAppStore } from "@/lib/store";
import { MuscleGroup, WorkoutPlan } from "@/types";

export function CreatePlanDialog({ onSave }: { onSave?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState<{ name: string; muscles: MuscleGroup[] }[]>([
    { name: "Treino A", muscles: [] }
  ]);

  const { addCustomPlan } = useAppStore();

  const handleAddDay = () => {
    setDays([...days, { name: `Treino ${String.fromCharCode(65 + days.length)}`, muscles: [] }]);
  };

  const handleRemoveDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index));
  };

  const toggleMuscle = (dayIndex: number, muscle: MuscleGroup) => {
    const newDays = [...days];
    const currentMuscles = newDays[dayIndex].muscles;
    
    if (currentMuscles.includes(muscle)) {
      newDays[dayIndex].muscles = currentMuscles.filter(m => m !== muscle);
    } else {
      newDays[dayIndex].muscles = [...currentMuscles, muscle];
    }
    
    setDays(newDays);
  };

  const handleSave = () => {
    if (!name || days.some(d => d.muscles.length === 0)) {
      alert("Por favor, preencha o nome do plano e selecione pelo menos um grupo muscular para cada dia.");
      return;
    }

    const newPlan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name,
      description: "Plano personalizado",
      level: "advanced", // Default
      split: days.map(d => ({
        day: d.name,
        muscleGroups: d.muscles,
        exercises: []
      }))
    };

    addCustomPlan(newPlan);
    setOpen(false);
    onSave?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4 gap-2">
          <Plus className="h-4 w-4" /> Criar Meu Próprio Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Novo Plano de Treino</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-2">
          <div className="space-y-2">
            <Label>Nome do Plano</Label>
            <Input 
              placeholder="Ex: Minha Hipertrofia" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Divisão de Treino</Label>
              <Button variant="outline" size="sm" onClick={handleAddDay}>
                Adicionar Dia
              </Button>
            </div>

            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="border rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <Input 
                    value={day.name} 
                    onChange={(e) => {
                      const newDays = [...days];
                      newDays[dayIndex].name = e.target.value;
                      setDays(newDays);
                    }}
                    className="h-8 w-32 font-bold"
                  />
                  {days.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveDay(dayIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(MUSCLE_LABELS) as [MuscleGroup, string][]).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`d${dayIndex}-${key}`} 
                        checked={day.muscles.includes(key)}
                        onCheckedChange={() => toggleMuscle(dayIndex, key)}
                      />
                      <label 
                        htmlFor={`d${dayIndex}-${key}`} 
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full">
            Salvar Plano
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
