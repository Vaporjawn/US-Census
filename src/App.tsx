import { useState, ReactNode } from 'react';
import { Container, Tabs, Tab, Box, Paper } from '@mui/material';
import Layout from './components/Layout/Layout';
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Tab label="American Community Survey" />
            <Tab label="Income & Poverty (SAIPE)" />
            <Tab label="2020 Census" />
            <Tab label="International Trade" />
            <Tab label="Business Patterns (CBP)" />
            <Tab label="Health Insurance (SAHIE)" />
            <Tab label="Construction Spending" />
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
    </Layout>
  );
}

export default App;
