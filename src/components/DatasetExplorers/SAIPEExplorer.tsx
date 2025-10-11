import { useState } from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import { Download, TrendingUp } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import censusApi from '../../services/censusApi';
import { useStates } from '../../hooks/useCensusData';

interface CensusData {
  headers: string[];
  data: Record<string, string>[];
  raw: string[][];
}

interface ChartDataPoint {
  year: string;
  povertyRate: number;
  medianIncome: number;
}

const SAIPEExplorer: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('2019');
  const [endYear, setEndYear] = useState<string>('2023');
  const [data, setData] = useState<CensusData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const { states } = useStates();

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const variables = ['NAME', 'SAEPOVRTALL_PT', 'SAEMHI_PT', 'SAEPOVALL_PT'];
      const years = [];

      for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
        years.push(year);
      }

      const allData = [];
      const chartDataTemp = [];

      for (const year of years) {
        try {
          const geography = selectedState
            ? { for: `state:${selectedState}` }
            : { for: 'state:*' };

          const result = await censusApi.getSAIPE(year.toString(), variables, geography);

          allData.push(...result.data.map(d => ({ ...d, year: year.toString() })));

          if (result.data.length > 0) {
            const stateData = result.data[0];
            chartDataTemp.push({
              year: year.toString(),
              povertyRate: parseFloat(stateData.SAEPOVRTALL_PT || '0'),
              medianIncome: parseFloat(stateData.SAEMHI_PT || '0'),
            });
          }
        } catch (err) {
          console.error(`Error fetching year ${year}:`, err);
        }
      }

      setData({ data: allData, headers: [...variables, 'year'], raw: [] });
      setChartData(chartDataTemp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const csv = [
      data.headers.join(','),
      ...data.data.map(row =>
        data.headers.map(header => row[header]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saipe_data_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          💰 Small Area Income & Poverty Estimates (SAIPE)
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e: SelectChangeEvent) => setSelectedState(e.target.value)}
              >
                <MenuItem value="">United States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.state} value={state.state}>
                    {state.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              helperText="e.g., 2019"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              helperText="e.g., 2023"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={handleFetch}
              disabled={loading}
              fullWidth
              sx={{ height: 56 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {chartData.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp /> Poverty Rate Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="povertyRate"
                  stroke="#1976d2"
                  name="Poverty Rate (%)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {data && (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Data Results ({data.data.length} rows)
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
              >
                Export CSV
              </Button>
            </Box>

            <TableContainer component={Paper}>
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
                <Typography variant="caption" sx={{ p: 2, display: 'block' }}>
                  Showing 50 of {data.data.length} rows
                </Typography>
              )}
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SAIPEExplorer;
