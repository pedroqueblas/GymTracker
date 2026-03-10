"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { WorkoutSession } from "@/types";

export function CardioLogger() {
  const { addCardioLog, activeWorkout } = useAppStore();
  type CardioType = NonNullable<WorkoutSession["cardio"]>["type"];
  type CardioIntensity = NonNullable<WorkoutSession["cardio"]>["intensity"];
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<CardioType>("treadmill");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [intensity, setIntensity] = useState<CardioIntensity>("moderate");

  const existingCardio = activeWorkout?.cardio;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;
    if (existingCardio) {
      setType(existingCardio.type);
      setDuration(String(existingCardio.durationMinutes));
      setDistance(String(existingCardio.distanceKm));
      setIntensity(existingCardio.intensity);
      return;
    }
    setType("treadmill");
    setDuration("");
    setDistance("");
    setIntensity("moderate");
  };

  const numericDuration = useMemo(() => parseFloat(duration), [duration]);
  const numericDistance = useMemo(() => parseFloat(distance), [distance]);
  const paceSecondsPerKm = useMemo(() => {
    if (!numericDuration || !numericDistance) return null;
    return Math.round((numericDuration * 60) / numericDistance);
  }, [numericDuration, numericDistance]);
  const paceLabel = useMemo(() => {
    if (!paceSecondsPerKm) return "--:-- min/km";
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = paceSecondsPerKm % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
  }, [paceSecondsPerKm]);
  const averageSpeed = useMemo(() => {
    if (!numericDuration || !numericDistance) return null;
    return numericDistance / (numericDuration / 60);
  }, [numericDuration, numericDistance]);

  const handleSave = () => {
    if (!numericDuration || !numericDistance) return;
    
    addCardioLog({
      type,
      durationMinutes: numericDuration,
      distanceKm: numericDistance,
      intensity
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-dashed">
          <Timer className="h-4 w-4" /> 
          {existingCardio ? "Editar Cardio" : "Adicionar Cardio"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Cardio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Atividade</Label>
            <Select value={type} onValueChange={(v) => setType(v as CardioType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="treadmill">Esteira</SelectItem>
                <SelectItem value="bike">Bicicleta</SelectItem>
                <SelectItem value="stairs">Escada</SelectItem>
                <SelectItem value="elliptical">Elíptico</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duração (minutos)</Label>
            <Input 
              type="number" 
              placeholder="Ex: 20" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Distância (km)</Label>
            <Input 
              type="number"
              placeholder="Ex: 4.2"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Intensidade</Label>
            <Select value={intensity} onValueChange={(v) => setIntensity(v as CardioIntensity)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Leve</SelectItem>
                <SelectItem value="moderate">Moderada</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Ritmo médio</span>
              <span className="font-medium text-foreground">{paceLabel}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>Velocidade média</span>
              <span className="font-medium text-foreground">
                {averageSpeed ? `${averageSpeed.toFixed(1)} km/h` : "--"}
              </span>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleSave}>
            Salvar Cardio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
