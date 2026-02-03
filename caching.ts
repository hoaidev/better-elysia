import { redis } from "bun"

class CacheProvider {
  private static _instance: CacheProvider
  private readonly memoryCache: Map<string, string | null> | undefined
  private readonly isRedis: boolean | undefined
  private readonly ttlSeconds: number | undefined

  constructor() {
    if (CacheProvider._instance) {
      return CacheProvider._instance
    }

    this.isRedis = !!process.env.REDIS_URL
    this.ttlSeconds = process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL) : 60
    this.memoryCache = new Map()
    return (CacheProvider._instance = this)
  }

  async get(key: string): Promise<string | null | undefined> {
    if (this.isRedis) {
      return await redis.get(key)
    }
    return this.memoryCache!.get(key)
  }

  async set(key: string, value: unknown, ttlSeconds = this.ttlSeconds!) {
    const serialized: string = JSON.stringify(value)

    if (this.isRedis) {
      if (ttlSeconds > 0) {
        await redis.setex(key, ttlSeconds, serialized)
      } else {
        await redis.set(key, serialized)
      }
    } else {
      this.memoryCache!.set(key, serialized)
      if (ttlSeconds > 0) {
        setTimeout(() => this.memoryCache!.delete(key), ttlSeconds * 1000)
      }
    }
  }

  async del(key: string) {
    if (this.isRedis) {
      await redis.del(key)
    } else {
      this.memoryCache!.delete(key)
    }
  }
}

const cacheProvider = new CacheProvider()
export { cacheProvider }
