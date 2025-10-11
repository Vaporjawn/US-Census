# 🇺🇸 US Census Data Explorer

A comprehensive web application for exploring and visualizing data from multiple US Census Bureau APIs. Features a beautiful Material-UI interface with dark/light mode support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the application.

## ✨ Features

### 🚀 Core Features
- **7 Dataset Explorers**: ACS, SAIPE, Decennial Census, International Trade, CBP, SAHIE, Construction
- **📊 8 Chart Types**: Bar, Line, Area, Pie, Scatter, Stacked Bar, Radar, and Mixed visualizations
- **🎨 Interactive Visualizations**: Switch between chart and table views with one click
- **⚡ Instant Data Loading**: No waiting - data appears immediately when you open the page
- **💾 Intelligent Caching**: Dual-layer caching (memory + localStorage) for blazing fast performance
- **🔄 Auto-Preloading**: Common datasets preloaded on app startup
- **🌙 Dark/Light Mode**: Seamless theme switching with localStorage persistence
- **📈 Advanced Chart Controls**: Configure X/Y axes, select multiple metrics, fullscreen mode
- **📥 CSV Export**: Download queried data for offline analysis
- **📱 Responsive Design**: Optimized for all screen sizes
- **💨 Persistent Storage**: Data survives browser refreshes and restarts

### ⚡ Performance Benefits
- **Instant Page Load**: Data cached for immediate display (< 100ms)
- **No Manual Fetching**: Data loads automatically on component mount
- **Smart Caching**: 1-hour cache TTL with automatic cleanup
- **Optimized Charts**: Up to 20 records for smooth visualization
- **Offline Ready**: Previously viewed data available without internet

### 📊 Visualization Capabilities
- **Bar Charts**: Compare values across categories (states, counties)
- **Line Charts**: Show trends and changes over time
- **Area Charts**: Emphasize magnitude of change
- **Pie Charts**: Display proportional relationships
- **Scatter Plots**: Explore correlations between variables
- **Stacked Bars**: Part-to-whole comparisons
- **Radar Charts**: Multi-dimensional analysis (up to 8 dimensions)
- **Mixed Charts**: Combine bars and lines for complex analysis

See [CACHING_SYSTEM.md](./CACHING_SYSTEM.md) for caching details and [VISUALIZATION_GUIDE.md](./VISUALIZATION_GUIDE.md) for visualization features.

## 📊 Available Datasets

1. **American Community Survey (ACS)**: Demographics, income, education, housing
2. **SAIPE**: Poverty and income estimates with trend analysis
3. **2020 Decennial Census**: Complete population counts
4. **International Trade**: Export statistics by industry
5. **County Business Patterns**: Business establishment data
6. **SAHIE**: Health insurance coverage estimates
7. **Construction Spending**: Monthly construction indicators

## 📖 Documentation

### User Guides
- **[Quick Start Guide](./README_PROJECT.md)** - Getting started with the application
- **[Visualization Guide](./VISUALIZATION_GUIDE.md)** - Complete guide to 8 interactive chart types
- **[Census API Catalog](./README_CensusCatalog.txt)** - Available datasets and variables
- **[Caching System](./CACHING_SYSTEM.md)** - Data caching and instant loading features

### Technical Documentation
- **[Visualization Implementation](./VISUALIZATION_IMPLEMENTATION.md)** - Developer guide for chart components
- **[Architecture](./ARCHITECTURE.md)** - System design and structure (if available)
- **[Development Guide](./DEVELOPMENT.md)** - Setup and workflows (if available)

### External Resources
- **Census API Docs**: https://www.census.gov/data/developers

## 🛠️ Tech Stack

- React 19.1.1 + Vite 7.1.9
- Material-UI v5
- Recharts for data visualization
- Axios for API calls

## 👤 Author

**Victor Williams** ([@Vaporjawn](https://github.com/Vaporjawn))

---

Built with ❤️ using React + Vite
