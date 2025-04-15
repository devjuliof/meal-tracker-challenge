import mongoose, { Schema } from "mongoose";

const MealSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  calories: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, default: "/placeholder.svg?height=200&width=400" },
  isFavorite: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export function getMealModel() {
  return mongoose.models.Meal || mongoose.model("Meal", MealSchema);
}

export type MealType = mongoose.InferSchemaType<typeof MealSchema>;
