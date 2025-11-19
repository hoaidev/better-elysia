import { redis } from "bun"

class CacheProvider {
  private static _instance: CacheProvider
  private readonly memoryCache: Map<string, unknown> | undefined

  // TODO handle TTL via process.env.TTL
  // Also override cache control via decorator

  constructor() {
    if (CacheProvider._instance) {
      return CacheProvider._instance
    }

    this.memoryCache = new Map()
    return (CacheProvider._instance = this)
  }

  async get(key: string) {
    if (redis.connected) {
      return await redis.get(key)
    }
    return this.memoryCache!.get(key)
  }

  async set(key: string, value: unknown, ttlSeconds = 0) {
    const serialized = JSON.stringify(value)

    if (redis.connected) {
      if (ttlSeconds > 0) {
        await redis.setex(key, ttlSeconds, serialized)
      } else {
        await redis.set(key, serialized)
      }
    } else {
      this.memoryCache!.set(key, value)
      if (ttlSeconds > 0) {
        setTimeout(() => this.memoryCache!.delete(key), ttlSeconds * 1000)
      }
    }
  }

  async del(key: string) {
    if (redis.connected) {
      await redis.del(key)
    } else {
      this.memoryCache!.delete(key)
    }
  }
}

const cacheProvider = new CacheProvider()
export { cacheProvider }
