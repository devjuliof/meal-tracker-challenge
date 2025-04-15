import type { Meal } from "../../lib/types";
import { apiRoutes } from "../constants/api-routes";

// Get meals from localStorage
const listMeals = async (): Promise<{ data: Meal[] }> => {
  const response = await fetch(apiRoutes.listMeals());

  const result = await response.json();
  return result;
};

const deleteMeal = async (id: string): Promise<Meal> => {
  const response = await fetch(apiRoutes.deleteMeal(id), {
    method: "DELETE",
  });

  const result = await response.json();
  return result;
};

const createMeal = async (meal: Meal) => {
  const response = await fetch(apiRoutes.createMeal(), {
    method: "POST",
    body: JSON.stringify(meal),
  });

  const result = await response.json();
  return result;
};

const editMeal = async (meal: Meal) => {
  const response = await fetch(apiRoutes.editMeal(), {
    method: "PUT",
    body: JSON.stringify(meal),
  });

  const result = await response.json();
  return result;
};

const favoriteMeal = async (id: string) => {
  const response = await fetch(apiRoutes.favoriteMeal(id), {
    method: "PATCH",
  });

  const result = await response.json();
  return result;
};

export const MealsService = {
  listMeals,
  deleteMeal,
  createMeal,
  editMeal,
  favoriteMeal,
};
