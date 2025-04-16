import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserModel } from "@/lib/models/User";

const User = getUserModel();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign(
    { id: newUser._id, name: newUser.name, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const response = NextResponse.json({
    message: "User created",
    userId: newUser._id,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
