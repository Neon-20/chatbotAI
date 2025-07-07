import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    const { supabase, response } = createClient(request)

    const session = await supabase.auth.getSession()

    // Check for protected admin routes - use exact path matching to prevent bypass
    const pathname = request.nextUrl.pathname
    const pathSegments = pathname.split('/').filter(Boolean)

    // More secure route matching - check for exact path segments
    const isAdminRoute = pathSegments.includes('admin')
    const isAnalyticsRoute = pathSegments.includes('analytics')
    const isTileInsightsRoute = pathSegments.includes('tile_insights')

    // If accessing protected routes, check authentication and authorization
    if (isAdminRoute || isAnalyticsRoute || isTileInsightsRoute) {
      // Redirect to login if not authenticated
      if (!session.data.session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("roles")
        .eq("user_id", session.data.session.user.id)
        .single()

      if (profileError || !profile || !profile.roles) {
        // Log error for debugging but don't expose details to user
        console.error('Profile fetch error in middleware:', profileError?.message)
        return NextResponse.redirect(new URL('/access-denied', request.url))
      }

      // Check role-based access
      if (isAdminRoute) {
        // Admin route: requires admin or superadmin role
        if (!['admin', 'superadmin'].includes(profile.roles)) {
          return NextResponse.redirect(new URL('/access-denied', request.url))
        }
      } else if (isAnalyticsRoute || isTileInsightsRoute) {
        // Analytics and tile insights routes: requires superadmin role only
        if (profile.roles !== 'superadmin') {
          return NextResponse.redirect(new URL('/access-denied', request.url))
        }
      }
    }

    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message)
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }
    if (request.geo) {
      response.headers.set("X-Geo-City", request.geo.city ?? "Unknown")
      response.headers.set("X-Geo-Country", request.geo.country ?? "Unknown")
      response.headers.set("X-Geo-Region", request.geo.region ?? "Unknown")
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
