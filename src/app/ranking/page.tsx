"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";

interface RankingUser {
  id: string;
  name: string;
  points: number;
  photoURL?: string;
  rank: number;
  isMe: boolean;
}

export default function RankingPage() {
  const { user: currentUser } = useAuth();
  const [weeklyUsers, setWeeklyUsers] = useState<RankingUser[]>([]);
  const [allTimeUsers, setAllTimeUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setWeeklyUsers([]);
        setAllTimeUsers([]);
        setErrorMessage("Ranking indisponível.");
        setLoading(false);
        return;
      }
      try {
        setErrorMessage(null);
        const userDocRef = doc(db, "users", currentUser.uid);
        await getDoc(userDocRef);
        const usersRef = collection(db, "users");
        // Fetch all users and sort client-side to avoid index requirements for now
        // In a real large app, you'd use orderBy and limit with Firestore indexes
        const snapshot = await getDocs(usersRef);
        
        const users = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.displayName || "Usuário",
            photoURL: data.photoURL,
            stats: data.stats || { totalVolume: 0, weeklyVolume: 0 }
          };
        });

        // Sort for Weekly
        const sortedWeekly = [...users]
          .sort((a, b) => (b.stats.weeklyVolume || 0) - (a.stats.weeklyVolume || 0))
          .map((u, index) => ({
            id: u.id,
            name: u.name,
            points: u.stats.weeklyVolume || 0,
            photoURL: u.photoURL,
            rank: index + 1,
            isMe: currentUser?.uid === u.id
          }));

        // Sort for All Time (Monthly tab -> Geral)
        const sortedAllTime = [...users]
          .sort((a, b) => (b.stats.totalVolume || 0) - (a.stats.totalVolume || 0))
          .map((u, index) => ({
            id: u.id,
            name: u.name,
            points: u.stats.totalVolume || 0,
            photoURL: u.photoURL,
            rank: index + 1,
            isMe: currentUser?.uid === u.id
          }));

        setWeeklyUsers(sortedWeekly);
        setAllTimeUsers(sortedAllTime);
      } catch (error) {
        const err = error as { code?: string };
        if (err?.code === "permission-denied") {
          setWeeklyUsers([]);
          setAllTimeUsers([]);
          setErrorMessage("Permissão insuficiente para carregar o ranking.");
        } else {
          console.error("Error fetching ranking:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ranking</h1>
        <p className="text-muted-foreground">Veja quem está treinando pesado!</p>
      </div>

      {errorMessage && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {errorMessage}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="alltime">Geral</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-4 space-y-4">
          <RankingList users={weeklyUsers} emptyMessage="Nenhum treino registrado nesta semana." />
        </TabsContent>
        
        <TabsContent value="alltime" className="mt-4 space-y-4">
          <RankingList users={allTimeUsers} emptyMessage="Nenhum treino registrado ainda." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RankingList({ users, emptyMessage }: { users: RankingUser[], emptyMessage: string }) {
  if (users.length === 0 || users.every(u => u.points === 0)) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Atletas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {users.filter(u => u.points > 0).map((user) => (
            <div 
              key={user.id} 
              className={`flex items-center p-4 gap-4 ${user.isMe ? 'bg-primary/10' : ''}`}
            >
              <div className="w-8 flex justify-center font-bold text-muted-foreground">
                {user.rank === 1 ? <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" /> :
                 user.rank === 2 ? <Medal className="h-6 w-6 text-gray-400" /> :
                 user.rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> :
                 `#${user.rank}`}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-background">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.name} />}
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {user.name}
                  {user.isMe && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Você</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(user.points / 1000)}k kg levantados
                </div>
              </div>
              
              <div className="font-mono font-bold text-primary">
                {user.points.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
