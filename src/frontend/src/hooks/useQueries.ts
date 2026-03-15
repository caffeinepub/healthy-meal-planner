import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GroceryItem, UserProfile, WeeklyPlan } from "../backend.d";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWeeklyMealPlan() {
  const { actor, isFetching } = useActor();
  return useQuery<WeeklyPlan | null>({
    queryKey: ["weeklyMealPlan"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWeeklyMealPlan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGroceryList() {
  const { actor, isFetching } = useActor();
  return useQuery<GroceryItem[]>({
    queryKey: ["groceryList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroceryList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      healthGoal,
    }: { displayName: string; healthGoal: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setUserProfile(displayName, healthGoal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyMealPlan"] });
      queryClient.invalidateQueries({ queryKey: ["groceryList"] });
    },
  });
}

export function useRegenerateMealPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.regenerateMealPlan();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeklyMealPlan"] });
      queryClient.invalidateQueries({ queryKey: ["groceryList"] });
    },
  });
}
