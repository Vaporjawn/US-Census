import { useState } from 'react';
import {
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterPlot as ScatterPlotIcon,
  TableChart as TableChartIcon,
  StackedBarChart as StackedBarChartIcon,
  Download,
  Fullscreen,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from 'recharts';

interface DataVisualizerProps {
  data: Record<string, string>[];
  headers: string[];
}

type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'stacked' | 'radar' | 'composed';

const COLORS = [
  '#003366', '#B22234', '#FFD700', '#4a90e2', '#ef4444',
  '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4',
  '#84cc16', '#f97316', '#14b8a6', '#a855f7', '#f43f5e'
];

const DataVisualizer: React.FC<DataVisualizerProps> = ({ data, headers }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>(headers[0] || '');
  const [yAxis, setYAxis] = useState<string[]>([headers[1] || '']);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter numeric columns for Y-axis
  const numericHeaders = headers.filter(header => {
    const sampleValue = data[0]?.[header];
    return sampleValue && !isNaN(Number(sampleValue)) && header !== 'state' && header !== 'county';
  });

  // Filter categorical columns for X-axis
  const categoricalHeaders = headers.filter(header => {
    return header === 'NAME' || header.includes('NAME') || header === 'state' || header === 'county';
  });

  const handleYAxisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setYAxis(typeof value === 'string' ? [value] : value);
  };

  // Transform data for charts
  const chartData = data.slice(0, 20).map(row => {
    const transformed: Record<string, string | number> = {
      [xAxis]: row[xAxis],
    };
    yAxis.forEach(y => {
      const value = Number(row[y]);
      transformed[y] = isNaN(value) ? 0 : value;
    });
    return transformed;
  });

  // Prepare data for pie chart
  const pieData = chartData.map(item => ({
    name: String(item[xAxis]),
    value: Number(item[yAxis[0]]) || 0,
  }));

  // Download chart as image
  const handleDownloadChart = () => {
    // This is a placeholder - in production, you'd use a library like html2canvas
    console.log('Download chart functionality');
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxis.map((y, index) => (
                <Bar
                  key={y}
                  dataKey={y}
                  fill={COLORS[index % COLORS.length]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxis.map((y, index) => (
                <Line
                  key={y}
                  type="monotone"
                  dataKey={y}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                {yAxis.map((y, index) => (
                  <linearGradient key={y} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxis.map((y, index) => (
                <Area
                  key={y}
                  type="monotone"
                  dataKey={y}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#color${index})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label
                outerRadius={isFullscreen ? 200 : 140}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={yAxis[0]}
                type="number"
                name={yAxis[0]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey={yAxis[1] || yAxis[0]}
                type="number"
                name={yAxis[1] || yAxis[0]}
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Scatter
                name="Data Points"
                data={chartData}
                fill={COLORS[0]}
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxis.map((y, index) => (
                <Bar
                  key={y}
                  dataKey={y}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                  radius={index === yAxis.length - 1 ? [8, 8, 0, 0] : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <RadarChart data={chartData.slice(0, 8)}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey={xAxis} tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
              {yAxis.map((y, index) => (
                <Radar
                  key={y}
                  name={y}
                  dataKey={y}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.5}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={xAxis}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxis.map((y, index) => {
                if (index === 0) {
                  return <Bar key={y} dataKey={y} fill={COLORS[index % COLORS.length]} radius={[8, 8, 0, 0]} />;
                } else {
                  return <Line key={y} type="monotone" dataKey={y} stroke={COLORS[index % COLORS.length]} strokeWidth={3} />;
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📊 Data Visualization
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download Chart">
              <IconButton size="small" onClick={handleDownloadChart}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton size="small" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chart Type Selector */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Chart Type
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, newType) => newType && setChartType(newType)}
            aria-label="chart type"
            sx={{ flexWrap: 'wrap' }}
          >
            <ToggleButton value="bar" aria-label="bar chart">
              <Tooltip title="Bar Chart">
                <BarChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Bar
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart">
              <Tooltip title="Line Chart">
                <LineChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Line
            </ToggleButton>
            <ToggleButton value="area" aria-label="area chart">
              <Tooltip title="Area Chart">
                <LineChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Area
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              <Tooltip title="Pie Chart">
                <PieChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Pie
            </ToggleButton>
            <ToggleButton value="scatter" aria-label="scatter plot">
              <Tooltip title="Scatter Plot">
                <ScatterPlotIcon sx={{ mr: 1 }} />
              </Tooltip>
              Scatter
            </ToggleButton>
            <ToggleButton value="stacked" aria-label="stacked bar chart">
              <Tooltip title="Stacked Bar">
                <StackedBarChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Stacked
            </ToggleButton>
            <ToggleButton value="radar" aria-label="radar chart">
              <Tooltip title="Radar Chart">
                <TableChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Radar
            </ToggleButton>
            <ToggleButton value="composed" aria-label="composed chart">
              <Tooltip title="Composed Chart">
                <BarChartIcon sx={{ mr: 1 }} />
              </Tooltip>
              Mixed
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Axis Configuration */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>X-Axis (Category)</InputLabel>
              <Select
                value={xAxis}
                label="X-Axis (Category)"
                onChange={(e) => setXAxis(e.target.value)}
              >
                {categoricalHeaders.map(header => (
                  <MenuItem key={header} value={header}>{header}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Y-Axis (Values)</InputLabel>
              <Select
                multiple
                value={yAxis}
                label="Y-Axis (Values)"
                onChange={handleYAxisChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {numericHeaders.map(header => (
                  <MenuItem key={header} value={header}>{header}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Chart Display */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'background.default',
            borderRadius: 2,
            minHeight: isFullscreen ? 650 : 450,
          }}
        >
          {renderChart()}
        </Paper>

        {/* Chart Info */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Displaying ${Math.min(chartData.length, 20)} of ${data.length} records`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`Chart Type: ${chartType.charAt(0).toUpperCase() + chartType.slice(1)}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          {yAxis.length > 0 && (
            <Chip
              label={`${yAxis.length} metric${yAxis.length > 1 ? 's' : ''} selected`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
