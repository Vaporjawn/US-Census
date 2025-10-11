/**
 * Cache Service with localStorage persistence
 * Provides intelligent caching with TTL (Time To Live) and automatic cleanup
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 1 hour)
  prefix?: string; // Cache key prefix
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour
  private readonly CACHE_PREFIX = 'census_cache_';

  /**
   * Generate cache key from endpoint and parameters
   */
  generateKey(endpoint: string, params?: Record<string, any>): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${this.CACHE_PREFIX}${endpoint}_${paramsStr}`;
  }

  /**
   * Get data from cache (memory first, then localStorage)
   */
  get<T>(key: string): T | null {
    // Check memory cache first (fastest)
    const memEntry = this.memoryCache.get(key);
    if (memEntry && memEntry.expiresAt > Date.now()) {
      return memEntry.data as T;
    }

    // Check localStorage (persistent)
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);

        // Check if expired
        if (entry.expiresAt > Date.now()) {
          // Restore to memory cache for faster access
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Expired, remove from localStorage
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    return null;
  }

  /**
   * Set data in cache (both memory and localStorage)
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.DEFAULT_TTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in localStorage (with error handling for quota exceeded)
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('localStorage quota exceeded, clearing old cache entries');
      this.clearExpired();

      // Try again after cleanup
      try {
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache data even after cleanup:', retryError);
      }
    }
  }

  /**
   * Check if cache has valid entry for key
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    this.memoryCache.delete(key);
    localStorage.removeItem(key);
  }

  /**
   * Clear all expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();

    // Clear from memory
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            if (entry.expiresAt <= now) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // Invalid entry, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.memoryCache.clear();

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memoryEntries: number;
    localStorageEntries: number;
    totalSize: number;
  } {
    let localStorageEntries = 0;
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        localStorageEntries++;
        const value = localStorage.getItem(key);
        totalSize += (key.length + (value?.length || 0)) * 2; // UTF-16 chars are 2 bytes
      }
    }

    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries,
      totalSize,
    };
  }

  /**
   * Preload data into cache
   */
  preload<T>(key: string, dataPromise: Promise<T>, options: CacheOptions = {}): Promise<T> {
    return dataPromise.then(data => {
      this.set(key, data, options);
      return data;
    });
  }
}

export default new CacheService();
