import { apiRoutes } from "@/constants/api-routes";

const getDashboardData = async () => {
  const response = await fetch(apiRoutes.getDashboardData());
  const result = await response.json();
  return result;
};

export const DashboardService = {
  getDashboardData,
};
