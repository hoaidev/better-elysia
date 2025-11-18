import type { Context } from "elysia/context"
import type { CommonResponseSchema } from "./response"

// Types
export type JwtPayload = { id?: string; email?: string; role?: string; iat?: number; exp?: number }

type UserPayload = { store: { user?: JwtPayload; roles?: string[] } }

const UNAUTHORIZED_MESSAGE: typeof CommonResponseSchema.Unauthorized.static = {
  message: "Unauthorized",
  success: false,
}

const FORBIDDEN_MESSAGE: typeof CommonResponseSchema.Forbidden.static = {
  message: "Forbidden",
  success: false,
}

export const onHandleAuthentication = (roles?: string[]) => async (c: Context & UserPayload) => {
  if ("jwt" in c) {
    const jwt = c.jwt as { verify: (token: string) => Promise<unknown> }
    const token = c.request.headers.get("Authorization")
    if (!token) {
      c.set.status = 401
      return UNAUTHORIZED_MESSAGE
    }

    const jwtVerifyResult = await jwt.verify(token.split("Bearer ")[1])
    if (!jwtVerifyResult) {
      c.set.status = 401
      return UNAUTHORIZED_MESSAGE
    }

    // verify successful
    c.store.user = jwtVerifyResult

    // handle authorization
    if (roles && c.store.user) {
      const hasPermission = roles.some((role) => c.store.user!.role === role)
      if (!hasPermission) {
        c.set.status = 403
        throw FORBIDDEN_MESSAGE
      }
    }
  }
}
