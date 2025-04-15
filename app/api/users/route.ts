import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserModel } from "@/lib/models/User";
import { UserType } from "@/lib/models/User"; // Importar o tipo UserType

const User = getUserModel();

// Atualizar todos os dados do usuário, considerando todos os campos possíveis
export async function PATCH(req: NextRequest) {
  await connectToDatabase();

  try {
    // Validação do token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Decodificando o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decoded.id;

    // Validando o corpo da requisição
    const body: Partial<UserType> = await req.json(); // Usando Partial para permitir qualquer campo

    // Verificação para garantir que pelo menos um campo de atualização foi passado
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "No update data provided" },
        { status: 400 }
      );
    }

    // Atualizando o usuário
    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true, // Garantir que a validação do Mongoose seja executada
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    // Mensagens de erro mais detalhadas para diferentes cenários
    const errorMessage =
      error instanceof jwt.JsonWebTokenError
        ? "Invalid token"
        : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
