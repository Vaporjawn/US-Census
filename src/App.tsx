import { useState, ReactNode } from 'react';
import { Container, Tabs, Tab, Box, Paper, Chip, useTheme } from '@mui/material';
import {
  Assessment,
  TrendingUp,
  People,
  Public,
  Business,
  HealthAndSafety,
  Construction
} from '@mui/icons-material';
import Layout from './components/Layout/Layout';
import DataPreloader from './components/DataPreloader/DataPreloader';
import ACSExplorer from './components/DatasetExplorers/ACSExplorer';
import SAIPEExplorer from './components/DatasetExplorers/SAIPEExplorer';
import DecennialExplorer from './components/DatasetExplorers/DecennialExplorer';
import TradeExplorer from './components/DatasetExplorers/TradeExplorer';
import CBPExplorer from './components/DatasetExplorers/CBPExplorer';
import SAHIEExplorer from './components/DatasetExplorers/SAHIEExplorer';
import ConstructionExplorer from './components/DatasetExplorers/ConstructionExplorer';

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            py: 4,
            animation: 'fadeIn 0.3s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Community Survey', icon: <Assessment />, badge: 'ACS' },
    { label: 'Income & Poverty', icon: <TrendingUp />, badge: 'SAIPE' },
    { label: '2020 Census', icon: <People />, badge: 'Decennial' },
    { label: 'International Trade', icon: <Public />, badge: 'Trade' },
    { label: 'Business Patterns', icon: <Business />, badge: 'CBP' },
    { label: 'Health Insurance', icon: <HealthAndSafety />, badge: 'SAHIE' },
    { label: 'Construction', icon: <Construction />, badge: 'Spending' },
  ];

  return (
    <Layout>
      <DataPreloader />
      <Box
        sx={{
          minHeight: 'calc(100vh - 80px)',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, rgba(0,51,102,0.02) 0%, rgba(178,34,52,0.02) 100%)'
            : 'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'transparent',
                px: 2,
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{tab.label}</span>
                      <Chip
                        label={tab.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: activeTab === index
                            ? (theme.palette.mode === 'light' ? 'primary.main' : 'primary.dark')
                            : 'action.selected',
                          color: activeTab === index ? 'white' : 'text.secondary',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Box>
                  }
                  sx={{
                    minHeight: 72,
                    py: 2,
                  }}
                />
              ))}
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <ACSExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <SAIPEExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <DecennialExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <TradeExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={4}>
              <CBPExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={5}>
              <SAHIEExplorer />
            </TabPanel>
            <TabPanel value={activeTab} index={6}>
              <ConstructionExplorer />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
}

export default App;
