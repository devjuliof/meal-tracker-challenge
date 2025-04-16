import { apiRoutes } from "@/constants/api-routes";
import { UserType } from "@/lib/models/User";

const updateUser = async (data: Partial<UserType>) => {
  const response = await fetch(apiRoutes.updateUser(), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};

const getUserData = async () => {
  const response = await fetch(apiRoutes.getUserData());
  const result = await response.json();
  return result;
};

export const UsersService = {
  updateUser,
  getUserData,
};
