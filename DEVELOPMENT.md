# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, Material-UI

### Development Setup

```bash
# Clone repository
git clone https://github.com/Vaporjawn/US-Census.git
cd US-Census

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Scripts

```json
{
  "dev": "vite",              // Start dev server
  "build": "vite build",      // Production build
  "preview": "vite preview",  // Preview production build
  "lint": "eslint ."          // Run ESLint
}
```

## Adding a New Dataset Explorer

### Step-by-Step Guide

#### 1. Add API Method to `src/services/censusApi.js`

```javascript
class CensusAPI {
  // Add new method
  async getNewDataset(year, variables, geography) {
    const params = {
      get: variables.join(','),
      for: geography.for,
    };

    if (geography.in) {
      params.in = geography.in;
    }

    const response = await this.client.get(`/data/${year}/newdataset`, { params });
    return this.transformData(response.data);
  }
}
```

#### 2. Create Explorer Component

```javascript
// src/components/DatasetExplorers/NewDatasetExplorer.jsx
import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import censusApi from '../../services/censusApi';

const NewDatasetExplorer = () => {
  const [year, setYear] = useState('2023');
  const [variables, setVariables] = useState('NAME,VAR1,VAR2');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const varsArray = variables.split(',').map(v => v.trim());
      const result = await censusApi.getNewDataset(
        year,
        varsArray,
        { for: 'state:*' }
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🆕 New Dataset Explorer
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Variables"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleFetch}
              disabled={loading}
            >
              Fetch Data
            </Button>
          </Grid>
        </Grid>

        {/* Add data display table here */}
      </CardContent>
    </Card>
  );
};

export default NewDatasetExplorer;
```

#### 3. Add to App.jsx

```javascript
// Import the new explorer
import NewDatasetExplorer from './components/DatasetExplorers/NewDatasetExplorer';

// Add a new Tab
<Tab label="New Dataset" />

// Add a new TabPanel
<TabPanel value={activeTab} index={7}>
  <NewDatasetExplorer />
</TabPanel>
```

## Common Development Tasks

### Adding State/County Selectors

Use the existing hooks:

```javascript
import { useStates, useCounties } from '../../hooks/useCensusData';

const MyComponent = () => {
  const { states, loading: statesLoading } = useStates();
  const [selectedState, setSelectedState] = useState('');
  const { counties, loading: countiesLoading } = useCounties(selectedState);

  return (
    <FormControl fullWidth>
      <Select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        {states.map((state) => (
          <MenuItem key={state.state} value={state.state}>
            {state.NAME}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
```

### Adding Data Visualization

Use Recharts for charts:

```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyChart = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
};
```

### Adding CSV Export

```javascript
const handleExport = () => {
  if (!data) return;

  const csv = [
    data.headers.join(','),
    ...data.raw.slice(1).map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data_${new Date().toISOString()}.csv`;
  a.click();
};
```

### Customizing Theme Colors

Edit `src/theme/theme.js`:

```javascript
const getTheme = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#YOUR_COLOR',
    },
    secondary: {
      main: '#YOUR_COLOR',
    },
  },
});
```

## Testing

### Manual Testing Checklist

- [ ] Theme toggle works (dark/light mode)
- [ ] All tabs navigate correctly
- [ ] Forms submit and fetch data
- [ ] Error messages display properly
- [ ] Data tables render correctly
- [ ] CSV export downloads valid files
- [ ] Responsive design on mobile/tablet
- [ ] Charts render with correct data

### API Testing

Test individual API calls:

```javascript
// In browser console
import censusApi from './services/censusApi';

// Test ACS call
const data = await censusApi.getACS5Year(
  2022,
  ['NAME', 'B01001_001E'],
  { for: 'state:06' }
);
console.log(data);
```

## Debugging

### Common Issues

#### 1. API Request Fails
- Check network tab in DevTools
- Verify variables are valid for the dataset
- Check Census API status: https://api.census.gov/data.html

#### 2. Component Not Rendering
- Check for console errors
- Verify imports are correct
- Check React DevTools component tree

#### 3. Theme Not Switching
- Clear localStorage: `localStorage.removeItem('themeMode')`
- Check ThemeContext is properly wrapped in main.jsx

### DevTools

**React DevTools**: Inspect component props and state
**Network Tab**: Monitor API requests and responses
**Console**: Check for JavaScript errors
**Application Tab**: Inspect localStorage

## Code Style Guidelines

### Component Structure

```javascript
// 1. Imports
import { useState } from 'react';
import { Card } from '@mui/material';

// 2. Component definition
const MyComponent = () => {
  // 3. State declarations
  const [data, setData] = useState(null);

  // 4. Effects and hooks
  useEffect(() => {
    // ...
  }, []);

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <Card>
      {/* ... */}
    </Card>
  );
};

// 7. Export
export default MyComponent;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ACSExplorer`)
- **Functions**: camelCase (e.g., `handleFetch`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `BASE_URL`)
- **Files**: Match component name (e.g., `ACSExplorer.jsx`)

## Performance Optimization

### Lazy Loading Components

```javascript
import { lazy, Suspense } from 'react';

const ACSExplorer = lazy(() => import('./components/DatasetExplorers/ACSExplorer'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ACSExplorer />
    </Suspense>
  );
}
```

### Memoization

```javascript
import { useMemo } from 'react';

const MyComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: item.value * 2
    }));
  }, [data]);

  return <div>{/* Use processedData */}</div>;
};
```

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Output in dist/ directory
# Files are minified, bundled, and optimized
```

### Environment Variables

Create `.env` file for configuration:

```bash
VITE_API_BASE_URL=https://api.census.gov/data
VITE_APP_TITLE=US Census Data Explorer
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### Hosting Options

- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag-and-drop dist/ folder
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## Contributing

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and commit: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request on GitHub

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
- `feat(api): add Business Dynamics Statistics dataset`
- `fix(table): correct pagination on mobile devices`
- `docs(readme): update installation instructions`

## Resources

### Official Documentation
- [React Docs](https://react.dev/)
- [Vite Docs](https://vite.dev/)
- [Material-UI Docs](https://mui.com/)
- [Census API Docs](https://www.census.gov/data/developers/data-sets.html)

### Helpful Tools
- [Census API Discovery Tool](https://api.census.gov/data.html)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [Material-UI Templates](https://mui.com/material-ui/getting-started/templates/)

### Community
- [Census API Google Group](https://groups.google.com/g/uscensusbureau)
- [React Discord](https://discord.gg/react)
- [Material-UI Discord](https://discord.gg/mui)

---

**Questions?** Open an issue on GitHub or reach out to [@Vaporjawn](https://github.com/Vaporjawn)
