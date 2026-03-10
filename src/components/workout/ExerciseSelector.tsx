"use client";

import { useState } from "react";
import { EXERCISES, MUSCLE_LABELS } from "@/data/exercises";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Exercise, MuscleGroup } from "@/types";

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | 'all'>('all');
  const [open, setOpen] = useState(false);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || ex.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleSelect = (ex: Exercise) => {
    onSelect(ex);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" /> Adicionar Exercício
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Exercício</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exercício..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-12 w-full whitespace-nowrap pb-2">
            <div className="flex space-x-2">
              <Badge 
                variant={selectedGroup === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedGroup('all')}
              >
                Todos
              </Badge>
              {Object.entries(MUSCLE_LABELS).map(([key, label]) => (
                <Badge
                  key={key}
                  variant={selectedGroup === key ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedGroup(key as MuscleGroup)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4">
          <div className="space-y-2">
            {filteredExercises.map((ex) => (
              <div 
                key={ex.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelect(ex)}
              >
                <div>
                  <div className="font-medium">{ex.name}</div>
                  <div className="text-xs text-muted-foreground">{MUSCLE_LABELS[ex.muscleGroup]}</div>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum exercício encontrado.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
