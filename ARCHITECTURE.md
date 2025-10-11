# Component Architecture Documentation

## Application Structure

```
App (main.jsx)
└── ThemeProvider (contexts/ThemeContext.jsx)
    ├── CssBaseline
    └── App.jsx
        └── Layout (components/Layout/Layout.jsx)
            ├── Header (components/Layout/Header.jsx)
            │   ├── Theme Toggle Button (useThemeMode hook)
            │   └── GitHub Link
            └── Container
                └── Tabs Navigation
                    ├── Tab: ACSExplorer
                    ├── Tab: SAIPEExplorer
                    ├── Tab: DecennialExplorer
                    ├── Tab: TradeExplorer
                    ├── Tab: CBPExplorer
                    ├── Tab: SAHIEExplorer
                    └── Tab: ConstructionExplorer
```

## Dataset Explorer Components

### Common Pattern
All dataset explorers follow this consistent architecture:

```
DatasetExplorer Component
├── Card (Material-UI)
│   └── CardContent
│       ├── Typography (Heading with emoji)
│       ├── Grid Container (Form inputs)
│       │   ├── TextField/Select (Parameters)
│       │   ├── Button (Fetch Data)
│       │   └── Button (Export CSV)
│       ├── Alert (Error display)
│       └── TableContainer (Data display)
│           └── Table (Sticky header, pagination)
```

### Explorer-Specific Features

#### 1. ACSExplorer
- **Dataset Selection**: Radio buttons for acs5, acs1, acs5profile
- **Geography**: State and County dropdowns (cascading)
- **Year Input**: TextField
- **Variables**: Multi-line TextField
- **Default Variables**: `NAME,B01001_001E,B19013_001E,B25077_001E`

#### 2. SAIPEExplorer
- **Time Range**: Start Year and End Year TextFields
- **Geography**: State dropdown
- **Variables**: Multi-line TextField
- **Visualization**: LineChart (Recharts) showing poverty rate trends
- **Default Variables**: `NAME,SAEPOVRTALL_PT,SAEMHI_PT,SAEPOVALL_PT`

#### 3. DecennialExplorer
- **Year**: Fixed to 2020
- **Variables**: Multi-line TextField
- **Geography**: State-level only
- **Default Variables**: `NAME,P1_001N,P2_001N,P2_002N`

#### 4. TradeExplorer
- **Time Input**: Year-Month (YYYY-MM format)
- **Variables**: Multi-line TextField
- **Geography**: All NAICS codes
- **Table**: 100 rows displayed
- **Default Variables**: `NAICS,CTY_CODE,ALL_VAL_MO`

#### 5. CBPExplorer
- **Year Input**: TextField
- **Geography**: State dropdown (optional)
- **Variables**: Multi-line TextField
- **Default Variables**: `NAME,NAICS2017,NAICS2017_LABEL,EMP,ESTAB,PAYANN`

#### 6. SAHIEExplorer
- **Time Range**: Start Year and End Year TextFields
- **Geography**: State dropdown (optional)
- **Variables**: Multi-line TextField
- **Default Variables**: `NAME,IPRCAT,IPR_DESC,NIPR,PCTIC,PCTUI`

#### 7. ConstructionExplorer
- **Time Input**: Year-Month (type="month")
- **Variables**: Multi-line TextField
- **Default Variables**: `cell_value,data_type_code,seasonally_adj`

## Shared Services

### censusApi.js
Singleton service class providing:

```javascript
class CensusAPI {
  // Core methods
  getACS5Year(year, variables, geography)
  getACS1Year(year, variables, geography)
  getACS5Profile(year, variables, geography)
  getDecennial2020DHC(variables, geography)
  getSAIPE(variables, geography, startYear, endYear)
  getSAHIE(variables, geography, startYear, endYear)
  getCBP(year, variables, geography)
  getTradeExportsNAICS(yearMonth, variables)
  getConstructionSpending(yearMonth, variables)

  // Helper methods
  getStates()
  getCounties(stateCode)
}
```

**Features**:
- Error handling with retries
- Data transformation (array-to-object mapping)
- Consistent response format: `{ headers, data, raw }`
- 30-second timeout per request

## Custom Hooks

### useCensusData.js
```javascript
// Generic data fetching hook with loading/error states
useCensusData(fetchFunction)

// Specific hooks
useStates() // Fetches all US states
useCounties(stateCode) // Fetches counties for a state
```

### useThemeMode.js
```javascript
// Theme context consumer hook
useThemeMode()
// Returns: { mode, toggleTheme }
```

## Theme System

### theme.js
```javascript
getTheme(mode) // Returns MUI theme configuration

Theme Features:
- Light/Dark mode color palettes
- Custom typography (Roboto/Inter)
- Component overrides (Card, Button, AppBar)
- Responsive breakpoints
- Custom shadows and transitions
```

### ThemeContext.jsx
```javascript
// Context provider managing:
- mode state (light/dark)
- toggleTheme function
- localStorage persistence
- MUI ThemeProvider integration
```

## Data Flow

### Typical User Interaction Flow

```
1. User selects dataset tab
   ↓
2. User fills form inputs (year, geography, variables)
   ↓
3. User clicks "Fetch Data" button
   ↓
4. Explorer component calls censusApi method
   ↓
5. API service makes HTTP request to Census API
   ↓
6. Response data transformed into structured format
   ↓
7. Explorer updates state with data
   ↓
8. Table component renders data rows
   ↓
9. (Optional) User clicks "Export CSV" to download data
```

### State Management

- **Global State**: Theme mode (Context API)
- **Local Component State**:
  - Form inputs (year, geography, variables)
  - Data results
  - Loading state
  - Error state

### API Request Pattern

```javascript
// 1. Set loading state
setLoading(true);
setError(null);

try {
  // 2. Parse variables
  const varsArray = variables.split(',').map(v => v.trim());

  // 3. Build geography object
  const geography = { for: 'state:*' };

  // 4. Call API service
  const result = await censusApi.getACS5Year(year, varsArray, geography);

  // 5. Update state with results
  setData(result);
} catch (err) {
  // 6. Handle errors
  setError(err.message);
} finally {
  // 7. Clear loading state
  setLoading(false);
}
```

## Styling Approach

- **Material-UI Components**: Primary UI building blocks
- **Theme System**: Centralized color/typography management
- **sx Prop**: Component-specific styling
- **Responsive Design**: Grid system and breakpoints
- **Dark Mode**: Automatic color switching via theme

## Performance Considerations

- **Code Splitting**: Vite automatic chunking
- **Lazy Loading**: Tab content only renders when active
- **Memoization**: Theme object memoized with useMemo
- **Table Pagination**: Limited row display (50-100 rows)
- **API Timeouts**: 30-second request timeout

## Error Handling

- **Network Errors**: Caught and displayed in Alert components
- **Invalid Parameters**: Validation before API calls
- **Empty Results**: User-friendly messages
- **Loading States**: CircularProgress indicators
- **Retry Logic**: Automatic retry on failed requests

---

**Last Updated**: Built during initial development phase
**Maintained By**: Victor Williams (@Vaporjawn)
