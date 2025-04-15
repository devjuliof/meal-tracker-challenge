import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getMealModel, MealType } from "@/lib/models/Meal";
import mongoose from "mongoose";
import { getUserModel } from "@/lib/models/User";

const Meal = getMealModel();
const User = getUserModel();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verificar o JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    await connectToDatabase();

    // Buscar as refeições associadas ao usuário
    const meals = await Meal.find({ user: payload.id });

    return NextResponse.json({ data: meals });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { name, description, calories, type, date, time, image, isFavorite } =
    await request.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Verificar se o usuário existe no banco
    const user = await User.findById(payload.id); // Buscando o usuário pelo ID
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!name || !calories || !type || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Convertendo payload.id para um ObjectId válido
    const userId = new mongoose.Types.ObjectId(payload.id as string);

    // Criando a refeição associada ao usuário
    const newMeal = await Meal.create({
      name,
      description: description || "",
      calories: Number(calories),
      type,
      date,
      time,
      image: image || "/placeholder.svg?height=200&width=400",
      isFavorite: isFavorite || false,
      user: userId, // Garantindo que o user seja um ObjectId válido
    });

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create meal" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { _id, ...updatedData } = await request.json();

  if (!_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verificar o JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    await connectToDatabase();

    // Buscar a refeição e verificar se pertence ao usuário
    const meal = await Meal.findById(_id);

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    if (meal.user.toString() !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Atualizar refeição
    const updatedMeal = await Meal.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });

    return NextResponse.json(updatedMeal);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update meal" },
      { status: 500 }
    );
  }
}
