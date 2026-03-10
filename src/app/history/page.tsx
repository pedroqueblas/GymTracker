"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Dumbbell, TrendingUp, Trophy, Calendar } from "lucide-react";
import { EXERCISES } from "@/data/exercises";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExerciseLog } from "@/types";

export default function HistoryPage() {
  const { workoutHistory } = useAppStore();

  // Calculate stats
  const totalWorkouts = workoutHistory.length;
  const totalVolume = workoutHistory.reduce((acc, w) => {
    return acc + w.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
    }, 0);
  }, 0);

  const maxWeight = workoutHistory.reduce((acc, w) => {
    return Math.max(acc, w.exercises.reduce((exAcc, ex) => {
      return Math.max(exAcc, ex.sets.reduce((sAcc, s) => Math.max(sAcc, s.weight), 0));
    }, 0));
  }, 0);

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weeklyWorkouts = workoutHistory.filter(w => new Date(w.date) >= startOfWeek).length;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">Sua jornada de evolução.</p>
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="h-6 w-6 text-primary mb-2" />
            <div className="text-xl font-bold">{(totalVolume / 1000).toFixed(1)}k</div>
            <p className="text-[10px] text-muted-foreground">Volume Total (kg)</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Dumbbell className="h-6 w-6 text-primary mb-2" />
            <div className="text-xl font-bold">{totalWorkouts}</div>
            <p className="text-[10px] text-muted-foreground">Treinos Totais</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-xl font-bold">{maxWeight}kg</div>
            <p className="text-[10px] text-muted-foreground">Recorde de Carga</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
            <Calendar className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold">{weeklyWorkouts}</div>
            <p className="text-[10px] text-muted-foreground">Treinos na Semana</p>
          </CardContent>
        </Card>
      </div>

      {workoutHistory.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>Nenhum treino registrado ainda.</p>
            <p className="text-sm mt-1">Complete seu primeiro treino hoje!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workoutHistory.map((workout) => {
            const performedExercises = workout.exercises.filter((ex) =>
              ex.sets.some((s) => s.completed && s.reps > 0)
            );
            const performedNames = performedExercises
              .map((ex) => getExerciseName(ex.exerciseId))
              .filter(Boolean);

            return (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(workout.date).toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
                    Concluído
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    {performedExercises.length}/{workout.exercises.length} Exercícios feitos
                  </div>
                  {workout.cardio && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {workout.cardio.durationMinutes} min • {formatDistance(workout.cardio.distanceKm)} • {formatPace(workout.cardio.durationMinutes, workout.cardio.distanceKm)}
                    </div>
                  )}
                </div>

                {performedNames.length > 0 && (
                  <div className="text-xs text-muted-foreground mb-3">
                    {performedNames.slice(0, 3).join(" • ")}
                    {performedNames.length > 3 ? ` • +${performedNames.length - 3}` : null}
                  </div>
                )}

                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-none">
                    <AccordionTrigger className="py-2 text-sm hover:no-underline text-primary">
                      Ver exercícios feitos
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {workout.cardio && (
                          <div className="bg-muted/30 p-2 rounded text-sm">
                            <span className="font-bold">Cardio:</span> {workout.cardio.durationMinutes}min • {formatDistance(workout.cardio.distanceKm)} • {formatPace(workout.cardio.durationMinutes, workout.cardio.distanceKm)} • {formatSpeed(workout.cardio.durationMinutes, workout.cardio.distanceKm)} de {workout.cardio.type === 'treadmill' ? 'Esteira' : 
                             workout.cardio.type === 'bike' ? 'Bicicleta' : 
                             workout.cardio.type === 'stairs' ? 'Escada' : 
                             workout.cardio.type === 'elliptical' ? 'Elíptico' : 'Outro'} 
                             <span className="text-xs text-muted-foreground ml-2">({workout.cardio.intensity === 'high' ? 'Intenso' : workout.cardio.intensity === 'moderate' ? 'Moderado' : 'Leve'})</span>
                          </div>
                        )}
                        
                        {performedExercises.length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            Nenhuma série concluída registrada neste treino.
                          </div>
                        ) : (
                          performedExercises.map((ex) => (
                            <ExerciseDetailItem key={ex.id} log={ex} />
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExerciseDetailItem({ log }: { log: ExerciseLog }) {
  const exerciseName = getExerciseName(log.exerciseId);
  const completedSets = log.sets.filter((s) => s.completed && s.reps > 0);
  const maxWeight =
    completedSets.length > 0 ? Math.max(...completedSets.map((s) => s.weight)) : 0;
  
  return (
    <div className="bg-muted/30 p-3 rounded-lg text-sm">
      <div className="flex justify-between font-medium mb-1">
        <span>{exerciseName}</span>
        <span className="text-xs bg-background border px-1.5 rounded flex items-center">
          Max: {maxWeight}kg
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {completedSets.map((set) => (
          <div
            key={set.id}
            className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border"
          >
            {set.weight}kg x {set.reps}
          </div>
        ))}
      </div>
    </div>
  );
}

function getExerciseName(exerciseId: string) {
  const exercise = EXERCISES.find((e) => e.id === exerciseId);
  return exercise?.name ?? exerciseId;
}

function formatPace(durationMinutes: number, distanceKm?: number) {
  if (!durationMinutes || !distanceKm || Number.isNaN(distanceKm)) return "--:-- min/km";
  const paceSeconds = Math.round((durationMinutes * 60) / distanceKm);
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = paceSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
}

function formatDistance(distanceKm?: number) {
  if (!distanceKm || Number.isNaN(distanceKm)) return "-- km";
  return `${distanceKm} km`;
}

function formatSpeed(durationMinutes: number, distanceKm?: number) {
  if (!durationMinutes || !distanceKm || Number.isNaN(distanceKm)) return "-- km/h";
  const hours = durationMinutes / 60;
  const speed = distanceKm / hours;
  return `${speed.toFixed(1)} km/h`;
}
