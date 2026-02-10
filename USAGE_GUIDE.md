# 📖 Usage Guide - US Census Data Explorer

## 🎯 Getting Started

### First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Wait a few seconds while common datasets preload
   - You'll see a progress bar at the top

### First Visit Experience

**What Happens:**
1. **DataPreloader** runs automatically
2. Checks if you have cached data
3. If not, preloads these datasets:
   - All US states list
   - ACS 5-Year data (2023)
   - SAIPE poverty data (2022)
   - SAHIE health insurance data (2022)
4. Shows progress bar during load
5. Stores everything in your browser's localStorage

**Time:**
- First visit: ~5-10 seconds for initial load
- All subsequent visits: **Instant!** (< 100ms)

## 🚀 Using the Application

### Navigation

The app has 7 tabs for different datasets:

1. **ACS (American Community Survey)**
   - Demographics, income, education, housing
   - 5-year estimates with detailed breakdowns

2. **SAIPE**
   - Poverty and income estimates
   - Time-series charts for trend analysis

3. **Decennial Census**
   - Official population counts
   - Conducted every 10 years

4. **Trade**
   - International export statistics
   - Industry-specific data

5. **CBP (County Business Patterns)**
   - Business establishment data
   - Employment and payroll statistics

6. **SAHIE**
   - Health insurance coverage estimates
   - State-level data

7. **Construction**
   - Monthly construction spending
   - Residential and non-residential

### Viewing Data

**Automatic Loading:**
- When you click a tab, data loads **automatically**
- No need to click "Fetch Data" anymore!
- You'll see "X records loaded • Cached data" if from cache

**Manual Refresh:**
- Click the **Refresh** button (circular arrow icon) to get latest data
- Useful if you want to force update the cache

**Export Data:**
- Click **Download CSV** button to export current dataset
- Opens in Excel or any CSV viewer

### Understanding Cache Indicators

**"Cached data" label:**
- Means data is loaded from your browser's cache
- Instant loading (no API call needed)
- Data is less than 1 hour old

**No label:**
- Data was just fetched from Census API
- Will be cached for future visits

**Record count:**
- Shows how many data records are displayed
- Example: "51 records loaded" (all states)

## 🎨 Using Dark/Light Mode

**Toggle Theme:**
- Click the sun/moon icon in the top-right corner
- Theme preference saved to localStorage
- Persists across browser sessions

**Theme Features:**
- Smooth transitions between modes
- Optimized colors for readability
- Material-UI components adapt automatically

## 📊 Working with Charts

**SAIPE Explorer** has time-series charts:

**Features:**
1. **Interactive Legend**: Click legend items to show/hide data series
2. **Hover Details**: Hover over chart to see exact values
3. **Responsive**: Charts resize with browser window

**Chart Data:**
- Poverty rate trends
- Median household income trends
- Multiple years of data

## 💾 Cache Management

### Checking Cache Status

**Browser Console Method:**
1. Open browser DevTools (`F12` or `Cmd+Option+I`)
2. Go to **Console** tab
3. Type: `window.censusApi.getCacheStats()`
4. Press Enter

**Output:**
```javascript
{
  memoryEntries: 15,
  localStorageEntries: 15,
  totalSize: 245760  // ~240 KB
}
```

### Viewing Cached Data

**Browser DevTools:**
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click your localhost URL
5. See all cached entries starting with `census_cache_`

### Clearing Cache

**Method 1: Browser DevTools**
1. Application tab → Local Storage
2. Right-click on your localhost
3. Click "Clear"

**Method 2: Programmatic (Console)**
```javascript
window.censusApi.clearCache();
```

**Method 3: Browser Settings**
- Settings → Privacy → Clear browsing data
- Select "Cached images and files"

### When to Clear Cache

**Clear cache if:**
- Data seems outdated (older than 1 hour)
- Experiencing display issues
- Want to force fresh data fetch
- Running out of storage space

**No need to clear if:**
- Everything working normally
- Data is recent
- App is fast and responsive

## 🔍 Troubleshooting

### "No Data Available"

**Possible Causes:**
1. Cache expired
2. API endpoint unavailable
3. Network connection issue

**Solutions:**
- Click **Refresh** button
- Check internet connection
- Clear cache and reload
- Check browser console for errors

### Slow Loading

**First Visit:**
- Normal - preloading datasets
- Wait ~5-10 seconds
- Subsequent visits will be instant

**Subsequent Visits:**
- Should be instant
- If slow, cache might be disabled
- Check browser settings allow localStorage

### Data Not Updating

**Problem:** Seeing old data even after changes

**Solution:**
1. Click **Refresh** button
2. Or clear cache manually
3. Data auto-updates after 1 hour TTL

### Storage Quota Exceeded

**Problem:** "localStorage quota exceeded" error

**Solution:**
- Cache automatically cleans expired entries
- Or manually clear cache
- Or adjust browser storage limits

## 📱 Mobile Usage

**Touch Gestures:**
- Tap tabs to switch datasets
- Scroll to view all data
- Pinch-zoom on charts (if enabled)

**Performance:**
- Caching works same as desktop
- May have smaller storage limit
- Use WiFi for initial preload

## ⚙️ Advanced Features

### Custom Queries

**ACS Explorer:**
- Select state from dropdown
- Choose variables (B01001_001E, etc.)
- Data auto-loads with caching

**SAIPE Explorer:**
- Year selector
- State filter
- Automatic chart generation

### CSV Export

**Steps:**
1. Load data in any explorer
2. Click "Download CSV" button
3. File downloads automatically
4. Open in Excel or Google Sheets

**CSV Format:**
- Headers: Variable names
- Rows: Each record
- Formatted for import/analysis

### Developer Tools

**Console Access:**
```javascript
// Access Census API service
window.censusApi

// Get cache statistics
window.censusApi.getCacheStats()

// Clear all cache
window.censusApi.clearCache()

// Preload data
window.censusApi.preloadCommonData()
```

## 🎓 Tips & Best Practices

### Performance Tips

1. **Let First Load Complete**: Don't navigate away during initial preload
2. **Use Cached Data**: Trust the cache - it's fast and accurate
3. **Refresh Strategically**: Only refresh when you need latest data
4. **Monitor Storage**: Check cache size occasionally

### Data Quality

1. **Understand TTL**: Cached data is fresh for 1 hour
2. **Check Record Count**: Verify you got all expected records
3. **Use Refresh**: Get latest data when it matters
4. **Export for Analysis**: Download CSV for detailed analysis

### Workflow Optimization

1. **Bookmark Favorites**: Bookmark frequently used dataset tabs
2. **Keyboard Shortcuts**: `Cmd/Ctrl + R` to refresh page
3. **Multiple Tabs**: Open different datasets in browser tabs
4. **Dark Mode**: Reduce eye strain during long sessions

## 🆘 Getting Help

### Resources

- **Caching Documentation**: [CACHING_SYSTEM.md](./CACHING_SYSTEM.md)
- **Project Documentation**: [README_PROJECT.md](./README_PROJECT.md)
- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Census API Docs**: https://www.census.gov/data/developers

### Common Questions

**Q: Why is first load slow?**
A: App preloads common datasets. Subsequent loads are instant.

**Q: Is my data private?**
A: Yes, all data cached locally in your browser. Never sent to external servers.

**Q: How much storage does cache use?**
A: Typically 200-500 KB for common datasets. Check with `getCacheStats()`.

**Q: Can I use offline?**
A: Previously viewed data works offline. New queries need internet.

**Q: Does cache work on mobile?**
A: Yes! Same caching system works on mobile browsers.

---

**Happy Exploring! 🎉**

For issues or questions, check the documentation or open an issue on GitHub.
