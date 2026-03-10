"use client";

import { WORKOUT_PLANS } from "@/data/plans";
import { MUSCLE_LABELS } from "@/data/exercises";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { CreatePlanDialog } from "@/components/plans/CreatePlanDialog";
import { useAppStore } from "@/lib/store";
import { WorkoutPlan } from "@/types";

export default function PlansPage() {
  const { customPlans } = useAppStore();

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Planos de Treino</h1>
        <p className="text-muted-foreground">Escolha uma divisão que se adapte à sua rotina.</p>
      </div>

      <CreatePlanDialog />

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="custom">Meus</TabsTrigger>
          <TabsTrigger value="beginner">Iniciante</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="mt-4 space-y-4">
          {customPlans.length === 0 ? (
             <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>Você ainda não criou nenhum plano.</p>
              <p className="text-sm">Clique em &quot;Criar Meu Próprio Plano&quot; acima.</p>
            </div>
          ) : (
            customPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))
          )}
        </TabsContent>

        <TabsContent value="beginner" className="mt-4 space-y-4">
          {WORKOUT_PLANS.filter(p => p.level === 'beginner').map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4 space-y-4">
           {WORKOUT_PLANS.filter(p => p.level === 'advanced').map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription className="mt-1">{plan.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {plan.split.map((day, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div>
                <div className="font-medium text-sm">{day.day}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {day.muscleGroups.map(mg => (
                    <Badge key={mg} variant="secondary" className="text-[10px] px-1 h-5">
                      {MUSCLE_LABELS[mg]}
                    </Badge>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/20">
           <Button className="w-full" variant="outline">
             Usar este Plano
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
