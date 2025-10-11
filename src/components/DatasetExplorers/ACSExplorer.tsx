import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { Download, Refresh, BarChart as BarChartIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import censusApi from '../../services/censusApi';
import { useStates, useCounties } from '../../hooks/useCensusData';
import DataVisualizer from '../Visualizations/DataVisualizer';

interface CensusData {
  headers: string[];
  data: Record<string, string>[];
  raw: string[][];
}

const ACSExplorer: React.FC = () => {
  const [year, setYear] = useState<string>('2023');
  const [datasetType, setDatasetType] = useState<string>('acs5');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [variables, setVariables] = useState<string>('NAME,B01001_001E,B19013_001E,B25077_001E');
  const [data, setData] = useState<CensusData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLoaded, setAutoLoaded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart'); // Default to chart view

  const { states } = useStates();
  const { counties } = useCounties(selectedState);

  // Auto-load data on component mount
  useEffect(() => {
    if (!autoLoaded) {
      const loadInitialData = async () => {
        await handleFetch(true);
      };
      loadInitialData();
      setAutoLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetch = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const varsArray = variables.split(',').map(v => v.trim());

      let geography = {};
      if (selectedCounty) {
        geography = {
          for: `county:${selectedCounty}`,
          in: `state:${selectedState}`
        };
      } else if (selectedState) {
        geography = { for: `state:${selectedState}` };
      } else {
        geography = { for: 'state:*' };
      }

      let result;
      if (datasetType === 'acs5') {
        result = await censusApi.getACS5Year(year, varsArray, geography);
      } else if (datasetType === 'acs1') {
        result = await censusApi.getACS1Year(year, varsArray, geography);
      } else {
        result = await censusApi.getACS5Profile(year, varsArray, geography);
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

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
    a.download = `acs_data_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            📊 American Community Survey (ACS) Data
          </Typography>
          {data && (
            <Typography variant="caption" color="text.secondary">
              {data.data.length} records loaded • Cached data
            </Typography>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Dataset Type</InputLabel>
              <Select
                value={datasetType}
                label="Dataset Type"
                onChange={(e) => setDatasetType(e.target.value)}
              >
                <MenuItem value="acs5">ACS 5-Year</MenuItem>
                <MenuItem value="acs1">ACS 1-Year</MenuItem>
                <MenuItem value="acs5profile">ACS 5-Year Profile</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              helperText="e.g., 2023, 2022"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCounty('');
                }}
              >
                <MenuItem value="">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.state} value={state.state}>
                    {state.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth disabled={!selectedState}>
              <InputLabel>County</InputLabel>
              <Select
                value={selectedCounty}
                label="County"
                onChange={(e) => setSelectedCounty(e.target.value)}
              >
                <MenuItem value="">All Counties</MenuItem>
                {counties.map((county) => (
                  <MenuItem key={county.county} value={county.county}>
                    {county.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Variables (comma-separated)"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              helperText="e.g., NAME,B01001_001E (Total Population),B19013_001E (Median Income)"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleFetch()}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => handleFetch()}
                disabled={loading}
              >
                Refresh
              </Button>

              {data && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  Export CSV
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data && (
          <>
            {/* View Mode Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
              <Tabs
                value={viewMode}
                onChange={(_e, newValue) => setViewMode(newValue)}
                aria-label="data view modes"
              >
                <Tab
                  icon={<BarChartIcon />}
                  iconPosition="start"
                  label="Chart View"
                  value="chart"
                />
                <Tab
                  icon={<TableChartIcon />}
                  iconPosition="start"
                  label="Table View"
                  value="table"
                />
              </Tabs>
            </Box>

            {/* Chart View */}
            {viewMode === 'chart' && (
              <DataVisualizer data={data.data} headers={data.headers} />
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {data.headers.map((header) => (
                        <TableCell key={header} sx={{ fontWeight: 600 }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.data.slice(0, 50).map((row, index) => (
                      <TableRow key={index} hover>
                        {data.headers.map((header) => (
                          <TableCell key={header}>{row[header]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.data.length > 50 && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Showing 50 of {data.data.length} rows •
                      {data.data.length > 0 && ' Cached data'}
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ACSExplorer;
