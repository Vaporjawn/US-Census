# 🔧 Developer Quick Reference - Caching System

## 🎯 Quick Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Browser Console Commands
```javascript
// Get cache statistics
window.censusApi.getCacheStats()

// Clear all cache
window.censusApi.clearCache()

// Manually preload data
window.censusApi.preloadCommonData()

// Access cache service directly
window.cacheService
```

## 📝 Code Snippets

### Using Cache in Components

```typescript
// Auto-load data on mount
useEffect(() => {
  const loadData = async () => {
    await fetchData(true); // true = silent load
  };
  loadData();
}, []);
```

### Manual Cache Operations

```typescript
import censusApi from '@/services/censusApi';

// Fetch with caching (default)
const data = await censusApi.fetchData('/2023/acs/acs5', {
  for: 'state:*',
  get: 'B01001_001E'
});

// Fetch without cache
const data = await censusApi.fetchData('/2023/acs/acs5', {
  for: 'state:*',
  get: 'B01001_001E'
}, false);
```

### Direct Cache Service Usage

```typescript
import cacheService from '@/services/cacheService';

// Generate cache key
const key = cacheService.generateKey('/endpoint', { params });

// Set cache
cacheService.set(key, data, { ttl: 3600000 }); // 1 hour

// Get cache
const cached = cacheService.get(key);

// Check cache
if (cacheService.has(key)) {
  // Use cached data
}

// Remove specific entry
cacheService.remove(key);

// Clear expired entries
cacheService.clearExpired();

// Clear all
cacheService.clearAll();

// Get statistics
const stats = cacheService.getStats();
```

## 🔍 Debugging

### Check Cache Status
```javascript
// In browser console
const stats = window.censusApi.getCacheStats();
console.log('Memory entries:', stats.memoryEntries);
console.log('localStorage entries:', stats.localStorageEntries);
console.log('Total size:', stats.totalSize, 'bytes');
```

### View Cache Entries
1. Open DevTools (`F12`)
2. Application tab
3. Local Storage
4. Find entries with `census_cache_` prefix

### Monitor Cache Hits/Misses
Look for console logs:
- `Cache hit: /endpoint` - Data from cache
- `Fetching from API: /endpoint` - Fresh API call

## 📊 Cache Configuration

### Default Settings
```typescript
// Cache TTL (Time To Live)
CACHE_TTL = 60 * 60 * 1000  // 1 hour

// localStorage prefix
STORAGE_PREFIX = 'census_cache_'

// Preload datasets
- getStates()
- getACS5Year(2023, 'state:*')
- getSAIPE(2022)
- getSAHIE(2022)
```

### Modify Cache TTL
```typescript
// In src/services/censusApi.ts
private readonly CACHE_TTL = 60 * 60 * 1000; // Change this value
```

### Customize Preload Datasets
```typescript
// In src/services/censusApi.ts - preloadCommonData()
const datasets = [
  this.getStates(),
  // Add/remove datasets here
];
```

## 🐛 Common Issues

### Issue: Data Not Caching
**Check:**
1. localStorage enabled in browser?
2. Private/incognito mode disabled?
3. Storage quota available?

**Fix:**
```javascript
// Clear cache and retry
window.censusApi.clearCache();
location.reload();
```

### Issue: Stale Data Showing
**Check:**
1. Cache TTL expired?
2. Manual refresh needed?

**Fix:**
- Click Refresh button in UI
- Or: `window.censusApi.clearCache()`

### Issue: localStorage Quota Exceeded
**Check:**
```javascript
const stats = window.censusApi.getCacheStats();
console.log('Storage used:', stats.totalSize);
```

**Fix:**
- Cache service auto-clears expired entries
- Or manually: `window.censusApi.clearCache()`

## 🎨 UI Integration

### Add Auto-Load to Component
```typescript
const [autoLoaded, setAutoLoaded] = useState(false);

useEffect(() => {
  if (!autoLoaded) {
    const loadInitialData = async () => {
      await handleFetch(true); // silent load
    };
    loadInitialData();
    setAutoLoaded(true);
  }
}, []);
```

### Add Cache Indicator
```tsx
{data && (
  <Typography variant="caption" color="text.secondary">
    {data.data.length} records loaded • Cached data
  </Typography>
)}
```

### Add Refresh Button
```tsx
<Button
  startIcon={<Refresh />}
  onClick={() => handleFetch()}
  variant="outlined"
>
  Refresh
</Button>
```

## 📁 File Locations

### Core Files
```
src/
  services/
    cacheService.ts       # Cache service implementation
    censusApi.ts          # API client with caching
  components/
    DataPreloader/
      DataPreloader.tsx   # Preload component
    DatasetExplorers/
      ACSExplorer.tsx     # Example auto-load
```

### Documentation
```
CACHING_SYSTEM.md         # Complete caching docs
USAGE_GUIDE.md           # User guide
IMPLEMENTATION_COMPLETE.md # Implementation summary
QUICK_REFERENCE.md       # This file
```

## 🧪 Testing Checklist

### Functional Tests
- [ ] First load shows preloader
- [ ] Data appears automatically
- [ ] Refresh updates data
- [ ] Cache persists on page reload
- [ ] localStorage stores data
- [ ] Expired cache cleaned up

### Performance Tests
- [ ] Cached load < 100ms
- [ ] Memory usage reasonable
- [ ] No memory leaks
- [ ] localStorage quota managed

### Error Tests
- [ ] Handles quota exceeded
- [ ] Falls back to API on cache fail
- [ ] Shows errors appropriately
- [ ] Recovers from network errors

## 🚀 Production Deployment

### Build
```bash
# Type check
npm run type-check

# Build
npm run build

# Preview
npm run preview
```

### Environment Variables (if needed)
```env
# None required - all caching is client-side
```

### Optimization Tips
1. Enable gzip compression on server
2. Set cache headers for static assets
3. Use CDN for bundle delivery
4. Monitor bundle size (currently ~870KB)

## 📊 Performance Metrics

### Target Metrics
- Cache hit rate: > 80%
- Cached data load: < 100ms
- First contentful paint: < 2s
- Time to interactive: < 3s

### Monitoring
```javascript
// Track cache hit rate
const stats = window.censusApi.getCacheStats();
const hitRate = stats.memoryEntries / totalRequests;
```

## 🔐 Security Notes

- No sensitive data cached (public Census data only)
- All caching client-side (localStorage)
- No server-side storage
- Users can clear via browser settings
- No authentication required

## 📖 Additional Resources

- [CACHING_SYSTEM.md](./CACHING_SYSTEM.md) - Complete documentation
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - User guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [Census API Docs](https://www.census.gov/data/developers) - API reference

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
