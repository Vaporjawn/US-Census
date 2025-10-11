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
import { Download } from '@mui/icons-material';
import censusApi from '../../services/censusApi';
import { useStates } from '../../hooks/useCensusData';

interface CensusData {
  headers: string[];
  data: Record<string, string>[];
  raw: string[][];
}

const CBPExplorer: React.FC = () => {
  const [year, setYear] = useState<string>('2022');
  const [selectedState, setSelectedState] = useState<string>('');
  const [variables, setVariables] = useState<string>('NAME,NAICS2017,NAICS2017_LABEL,EMP,ESTAB,PAYANN');
  const [data, setData] = useState<CensusData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { states } = useStates();

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const varsArray = variables.split(',').map(v => v.trim());
      const geography: { for: string; in?: string } = selectedState
        ? { for: `county:*`, in: `state:${selectedState}` }
        : { for: 'state:*' };

      const result = await censusApi.getCBP(year, varsArray, geography);
      setData(result);
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
      ...data.raw.slice(1).map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbp_${year}_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          🏢 County Business Patterns (CBP)
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              helperText="e.g., 2022, 2021, 2020"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e: SelectChangeEvent) => setSelectedState(e.target.value)}
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Variables (comma-separated)"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              helperText="e.g., NAME,NAICS2017,EMP (Employment),ESTAB (Establishments),PAYANN (Annual Payroll)"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleFetch}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
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
          <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 600 }}>
            <Table size="small" stickyHeader>
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
                {data.data.slice(0, 100).map((row, index) => (
                  <TableRow key={index} hover>
                    {data.headers.map((header) => (
                      <TableCell key={header}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.data.length > 100 && (
              <Typography variant="caption" sx={{ p: 2, display: 'block' }}>
                Showing 100 of {data.data.length} rows
              </Typography>
            )}
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CBPExplorer;
