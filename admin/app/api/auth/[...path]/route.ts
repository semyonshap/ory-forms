// app/api/auth/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  handleLogin,
  handleCallback,
  handleLogout,
  handleRefresh,
} from "@/features/oidc";

export async function GET(req: NextRequest) {
  // Извлекаем путь из URL: /api/auth/login → ["login"]
  const pathname = req.nextUrl.pathname;
  const action = pathname.split("/").pop(); // "login", "callback", "logout", "refresh"

  switch (action) {
    case "login":
      return handleLogin();

    case "callback":
      return handleCallback(req);

    case "logout":
      return handleLogout(req, "http://localhost:3001");

    case "refresh":
      return handleRefresh(req);

    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// POST тоже может понадобиться для некоторых провайдеров
export async function POST(req: NextRequest) {
  return GET(req);
}
