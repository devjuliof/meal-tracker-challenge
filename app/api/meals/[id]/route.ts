import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getMealModel } from "@/lib/models/Meal";

const Meal = getMealModel();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedMeal = await Meal.findByIdAndDelete(params.id);

    if (!deletedMeal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Meal deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    await connectToDatabase();

    const meal = await Meal.findById(id);

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    meal.isFavorite = !meal.isFavorite;
    await meal.save();

    return NextResponse.json({ message: "Favorite status updated", meal });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update favorite status" },
      { status: 500 }
    );
  }
}
