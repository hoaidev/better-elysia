/**
 * Extracts a plain object type from a @Service() class,
 * keeping only public method signatures.
 *
 * Usage in tests:
 *   const mock: ServiceInterface<TrackingService> = { ... }
 */
export type ServiceInterface<T> = {
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? K : never]: T[K]
}
