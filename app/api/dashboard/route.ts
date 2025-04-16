import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserModel } from "@/lib/models/User";
import { getMealModel } from "@/lib/models/Meal";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decoded.id;

    const User = getUserModel();
    const Meal = getMealModel();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const totalMeals = await Meal.countDocuments({ user: userId });

    const totalFavoriteMeals = await Meal.countDocuments({
      user: userId,
      isFavorite: true,
    });

    const meals = await Meal.find({ user: userId }).sort({ date: -1 });
    const mealDates = [...new Set(meals.map((meal) => meal.date))];

    let streak = 0;
    let currentDate = new Date();
    for (const dateStr of mealDates) {
      const mealDate = new Date(dateStr);
      const dayDiff = Math.floor(
        (currentDate.getTime() - mealDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayDiff === 0) {
        streak++;
      } else if (dayDiff === 1) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      dailyCalorieGoal: user.dailyCalorieGoal || 2000,
      totalMeals,
      totalFavoriteMeals,
      streak,
    });
  } catch (err) {
    console.error("[DASHBOARD_ERROR]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
