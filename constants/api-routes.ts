export const apiRoutes = {
  // Auth
  register: () => `/api/auth/register`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,

  // Users
  updateUser: () => `/api/users`,
  getUserData: () => `/api/users`,

  // Me
  me: () => `/api/me`,

  // Meals
  listMeals: () => `/api/meals`,
  deleteMeal: (id: string) => `/api/meals/${id}`,
  createMeal: () => `/api/meals`,
  editMeal: () => `/api/meals`,
  favoriteMeal: (id: string) => `/api/meals/${id}`,

  // Dashboard
  getDashboardData: () => `/api/dashboard`,
};
