import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Definindo as rotas públicas e privadas
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];
const PRIVATE_ROUTES = ["/dashboard", "/profile"]; // Ajuste conforme suas rotas privadas

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Obtém o token do cookie
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname); // Verifica se a rota é pública
  const isPrivateRoute = PRIVATE_ROUTES.includes(req.nextUrl.pathname); // Verifica se a rota é privada

  if (token) {
    try {
      // Verifica se o token é válido
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

      // Se o usuário estiver logado e tentar acessar uma rota pública, redireciona para o dashboard
      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Usuário logado e acessando rota privada → segue normal
      return NextResponse.next();
    } catch (err) {
      // Token inválido → redireciona para o login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Se não houver token e tentar acessar uma rota privada → redireciona para o login
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se não houver token e for rota pública → segue normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Aplica o middleware em todas as rotas, exceto as listadas
};
