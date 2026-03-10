"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppStore } from "@/lib/store";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useUserDataSync() {
  const { user, loading } = useAuth();
  const { 
    setFullState, 
    resetState,
    activeWorkout,
    workoutHistory,
    customPlans,
    hydration,
    bodyWeight
  } = useAppStore();

  // 1. Load data on login / Reset on logout
  useEffect(() => {
    if (loading) return;

    if (!user) {
      resetState();
      return;
    }

    const loadUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          // Load data into store
          setFullState({
            activeWorkout: data.activeWorkout || null,
            workoutHistory: data.workoutHistory || [],
            customPlans: data.customPlans || [],
            hydration: data.hydration || { current: 0, goal: 2500, lastUpdated: new Date().toISOString(), history: [] },
            bodyWeight: data.bodyWeight || [],
            // Don't sync restTimer usually, but if needed:
            // restTimer: data.restTimer
          });
        } else {
          // Initialize user doc if not exists
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            workoutHistory: [],
            customPlans: [],
            activeWorkout: null,
            hydration: { current: 0, goal: 2500, lastUpdated: new Date().toISOString(), history: [] },
            bodyWeight: []
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [user, loading, resetState, setFullState]);

  // 2. Sync changes to Firestore (Debounced or on key changes)
  // Simple implementation: Update full doc on changes to key arrays
  // In production, you might want more granular updates or a save button
  useEffect(() => {
    if (!user) return;

    const saveUserData = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;
        // Double check that the user is still logged in before saving
        if (!auth.currentUser || auth.currentUser.uid !== uid) return;
        // Calculate stats for ranking
        const totalVolume = workoutHistory.reduce((acc, w) => {
          return acc + w.exercises.reduce((exAcc, ex) => {
            return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
          }, 0);
        }, 0);

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyVolume = workoutHistory
          .filter(w => new Date(w.date) >= startOfWeek)
          .reduce((acc, w) => {
            return acc + w.exercises.reduce((exAcc, ex) => {
              return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
            }, 0);
          }, 0);

        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, {
          workoutHistory,
          customPlans,
          activeWorkout,
          hydration,
          bodyWeight,
          stats: {
            totalVolume,
            weeklyVolume,
            totalWorkouts: workoutHistory.length
          },
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

    // Use a timeout to debounce saves (e.g. 2 seconds after last change)
    const timeoutId = setTimeout(saveUserData, 2000);

    return () => clearTimeout(timeoutId);
  }, [user, workoutHistory, customPlans, activeWorkout, hydration, bodyWeight]);
}
