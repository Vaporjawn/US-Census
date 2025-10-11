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
  Box,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import censusApi from '../../services/censusApi';

interface CensusData {
  headers: string[];
  data: Record<string, string>[];
  raw: string[][];
}

const ConstructionExplorer: React.FC = () => {
  const [yearMonth, setYearMonth] = useState<string>('2024-01');
  const [variables, setVariables] = useState<string>('cell_value,data_type_code,seasonally_adj');
  const [data, setData] = useState<CensusData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const varsArray = variables.split(',').map(v => v.trim());
      const result = await censusApi.getConstructionSpending(yearMonth, varsArray);
      setData(result);
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
    a.download = `construction_${yearMonth}_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          🏗️ Construction Spending (EITS VIP)
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year-Month"
              type="month"
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
              helperText="Format: YYYY-MM (e.g., 2024-01)"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Variables (comma-separated)"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              helperText="e.g., cell_value (spending amount), data_type_code, seasonally_adj, error_data, category_code, cat_idx"
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

export default ConstructionExplorer;
