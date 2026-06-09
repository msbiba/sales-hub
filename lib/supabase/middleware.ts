import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/passwort-reset",
  "/passwort-neu",
  "/auth/callback",
  "/403",
  "/landing",
  "/impressum",
  "/datenschutz",
  "/api/lead",
];

const ROUTE_ROLES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/nutzer", roles: ["admin"] },
  { prefix: "/api/nutzer", roles: ["admin"] },
  { prefix: "/berichte", roles: ["admin", "buchhaltung"] },
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function routeRoles(pathname: string): string[] | null {
  for (const entry of ROUTE_ROLES) {
    if (pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)) {
      return entry.roles;
    }
  }
  return null;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauth
  if (!user && !isPublicPath(pathname)) {
    if (isApiPath(pathname)) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Eingeloggt auf /login → weiter zu /
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Eingeloggte User: Profile-Check (is_active + Rolle)
  if (user && !isPublicPath(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    // Fallback: kein Profile-Row → durchlassen (RLS-Setup-Phase, Bootstrap)
    if (profile) {
      if (!profile.is_active) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        url.searchParams.set("inactive", "1");
        return NextResponse.redirect(url);
      }

      const required = routeRoles(pathname);
      if (required && !required.includes(profile.role)) {
        if (isApiPath(pathname)) {
          return NextResponse.json(
            { error: "Keine Berechtigung" },
            { status: 403 }
          );
        }
        const url = request.nextUrl.clone();
        url.pathname = "/403";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
