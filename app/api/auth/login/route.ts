import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserModel } from "@/lib/models/User";

const User = getUserModel();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const response = NextResponse.json({ message: "Login successful", token });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });
  console.lo;
  return response;
}
