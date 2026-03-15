import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WeeklyPlan {
    tuesday: DailyMeals;
    wednesday: DailyMeals;
    saturday: DailyMeals;
    thursday: DailyMeals;
    sunday: DailyMeals;
    friday: DailyMeals;
    monday: DailyMeals;
}
export interface DailyMeals {
    breakfast: string;
    lunch: string;
    dinner: string;
}
export interface GroceryItem {
    name: string;
    totalQuantity: string;
}
export interface UserProfile {
    healthGoal: T;
    displayName: string;
}
export enum T {
    muscle_gain = "muscle_gain",
    weight_loss = "weight_loss",
    balanced_diet = "balanced_diet"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGroceryList(): Promise<Array<GroceryItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyMealPlan(): Promise<WeeklyPlan | null>;
    isCallerAdmin(): Promise<boolean>;
    regenerateMealPlan(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserProfile(displayName: string, healthGoal: string): Promise<void>;
}
