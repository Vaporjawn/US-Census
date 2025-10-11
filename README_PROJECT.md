# 🇺🇸 US Census Data Explorer

A comprehensive, beautiful web application for exploring and visualizing data from multiple US Census Bureau APIs. Built with React, Vite, and Material-UI with full dark/light mode support.

![US Census Data Explorer](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF?logo=vite)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?logo=mui)

## 🚀 Features

### 📊 Dataset Explorers

- **American Community Survey (ACS)**: Access ACS 1-Year, 5-Year, and 5-Year Profile datasets with state and county-level data
- **Small Area Income & Poverty Estimates (SAIPE)**: Time-series poverty rate analysis with interactive charts
- **Decennial Census 2020**: Access DHC (Demographic and Housing Characteristics) data
- **International Trade**: Explore export data by NAICS codes with monthly timeseries
- **County Business Patterns (CBP)**: Establishments, employment, and payroll statistics
- **Small Area Health Insurance Estimates (SAHIE)**: Health insurance coverage rates by income level
- **Construction Spending (EITS)**: Monthly construction spending indicators

### 🎨 UI Features

- **Dark/Light Mode**: Seamless theme switching with localStorage persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Data Visualization**: Interactive charts using Recharts
- **CSV Export**: Download your queried data for offline analysis
- **Real-time Data**: Direct API integration with US Census Bureau

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Vaporjawn/US-Census.git
cd US-Census

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Technology Stack

- **React 19.1.1**: Modern React with functional components and hooks
- **Vite 7.1.9**: Lightning-fast build tool and dev server
- **Material-UI v5**: Comprehensive UI component library
- **Recharts**: Composable charting library for data visualization
- **Axios**: HTTP client for Census API requests
- **Emotion**: CSS-in-JS styling solution

## 📖 Usage

### Exploring Datasets

1. **Select a Dataset**: Use the tabs at the top to choose which Census dataset to explore
2. **Configure Parameters**: Each explorer provides forms to specify:
   - Geographic areas (states, counties)
   - Time periods (years, year ranges, or specific months)
   - Variables to retrieve
3. **Fetch Data**: Click the "Fetch Data" button to query the Census API
4. **View Results**: Browse data in interactive tables with pagination
5. **Export Data**: Download results as CSV for further analysis

### Example: American Community Survey

```javascript
// Navigate to ACS tab
// Select dataset type: "acs5" (5-Year estimates)
// Enter year: "2022"
// Select state: "California"
// Select county: "Los Angeles County"
// Variables: "NAME,B01001_001E,B19013_001E" (Name, Population, Median Income)
// Click "Fetch Data"
```

### Available Variables

Each dataset has different available variables. Common examples:

- **ACS**: `B01001_001E` (Total Population), `B19013_001E` (Median Household Income)
- **SAIPE**: `SAEPOVRTALL_PT` (Poverty Rate), `SAEMHI_PT` (Median Household Income)
- **Decennial**: `P1_001N` (Total Population), `P2_002N` (Hispanic or Latino)
- **Trade**: `ALL_VAL_MO` (Monthly Export Value), `NAICS` (Industry Code)

Refer to the [Census API documentation](https://api.census.gov/data.html) for complete variable lists.

## 🏗️ Project Structure

```
US-Census/
├── src/
│   ├── components/
│   │   ├── DatasetExplorers/
│   │   │   ├── ACSExplorer.jsx
│   │   │   ├── SAIPEExplorer.jsx
│   │   │   ├── DecennialExplorer.jsx
│   │   │   ├── TradeExplorer.jsx
│   │   │   ├── CBPExplorer.jsx
│   │   │   ├── SAHIEExplorer.jsx
│   │   │   └── ConstructionExplorer.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       └── Layout.jsx
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useCensusData.js
│   │   └── useThemeMode.js
│   ├── services/
│   │   └── censusApi.js
│   ├── theme/
│   │   └── theme.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Configuration

### API Service

The Census API service (`src/services/censusApi.js`) provides methods for all supported datasets:

```javascript
import censusApi from './services/censusApi';

// Example: Fetch ACS 5-Year data
const data = await censusApi.getACS5Year(
  2022,
  ['NAME', 'B01001_001E'],
  { for: 'state:*' }
);
```

### Theme Customization

Modify the theme configuration in `src/theme/theme.js`:

```javascript
// Customize colors, typography, spacing, etc.
const theme = {
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};
```

## 📚 API Documentation

This application uses the official US Census Bureau API. Key endpoints:

- **ACS**: `/data/{year}/acs/acs{1|5|5profile}`
- **SAIPE**: `/data/timeseries/poverty/saipe`
- **Decennial**: `/data/2020/dec/dhc`
- **Trade**: `/data/timeseries/intltrade/exports/naics`
- **CBP**: `/data/{year}/cbp`
- **SAHIE**: `/data/timeseries/healthins/sahie`
- **Construction**: `/data/timeseries/eits/vip`

For more information, visit the [Census API Documentation](https://www.census.gov/data/developers/data-sets.html).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Victor Williams**
- GitHub: [@Vaporjawn](https://github.com/Vaporjawn)

## 🙏 Acknowledgments

- US Census Bureau for providing comprehensive public APIs
- Material-UI team for the excellent component library
- React and Vite communities for the amazing development tools

## 📸 Screenshots

### Light Mode
The application features a clean, modern interface with intuitive navigation and responsive design.

### Dark Mode
Perfect dark mode implementation with high contrast and reduced eye strain for extended data exploration sessions.

### Data Visualization
Interactive charts and tables for comprehensive data analysis and insights.

---

**Built with ❤️ by Victor Williams**
