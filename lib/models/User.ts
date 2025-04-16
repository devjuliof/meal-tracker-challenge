import mongoose from "mongoose";

export enum GenderEnum {
  FEMALE = "female",
  MALE = "male",
}

export enum ActivityLevelEnum {
  SEDENTARY = "sedentary",
  LIGHT = "light",
  MODERATE = "moderate",
  ACTIVE = "active",
  VERY_ACTIVE = "very_active",
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyCalorieGoal: { type: Number, required: false },
  gender: {
    type: String,
    enum: [GenderEnum.FEMALE, GenderEnum.MALE],
    required: false,
  },
  age: { type: Number, required: false },
  weight: { type: Number, required: false },
  height: { type: Number, required: false },
  activityLevel: {
    type: String,
    enum: [
      ActivityLevelEnum.SEDENTARY,
      ActivityLevelEnum.LIGHT,
      ActivityLevelEnum.MODERATE,
      ActivityLevelEnum.ACTIVE,
      ActivityLevelEnum.VERY_ACTIVE,
    ],
    required: false,
  },
  profileUrl: {
    type: String,
    required: false,
  },
});

export function getUserModel() {
  return mongoose.models.User || mongoose.model("User", UserSchema);
}

export type UserType = mongoose.InferSchemaType<typeof UserSchema>;
