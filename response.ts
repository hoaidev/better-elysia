import { t } from "elysia"

export namespace CommonResponseSchema {
  export const Success = t.Object({
    success: t.Boolean({ default: true }),
    message: t.String({ default: "Success" }),
    data: t.Optional(t.Any()),
  })
  export const Unauthorized = t.Object({
    success: t.Boolean({ default: false }),
    message: t.String({ default: "Unauthorized" }),
  })
  export const Forbidden = t.Object({
    success: t.Boolean({ default: false }),
    message: t.String({ default: "Forbidden" }),
  })
  export const BadRequest = t.Object({
    success: t.Boolean({ default: false }),
    message: t.String({ default: "Bad request" }),
    errors: t.Optional(t.Array(t.Object({ path: t.String(), message: t.String() }))),
  })
  export const NotFound = t.Object({
    success: t.Boolean({ default: false }),
    message: t.String({ default: "Not found" }),
  })
  export const InternalServerError = t.Object({
    success: t.Boolean({ default: false }),
    message: t.String({ default: "Internal server error" }),
    error: t.String({ default: "Unknown error" }),
  })
}
