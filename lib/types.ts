export type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner";

export interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: MealType;
  date: string;
  time: string;
  image: string;
  isFavorite: boolean;
}
