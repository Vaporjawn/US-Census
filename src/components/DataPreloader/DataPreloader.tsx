import { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography, Alert, Collapse } from '@mui/material';
import censusApi from '../../services/censusApi';

interface DataPreloaderProps {
  onComplete?: () => void;
}

const DataPreloader: React.FC<DataPreloaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const preloadData = async () => {
      try {
        setProgress(10);

        // Check if data is already cached
        const stats = censusApi.getCacheStats();
        if (stats.localStorageEntries > 0) {
          console.log('Using cached data:', stats);
          setProgress(100);
          setLoading(false);

          // Hide loader after a short delay
          setTimeout(() => {
            setShow(false);
            onComplete?.();
          }, 500);
          return;
        }

        setProgress(25);

        // Preload common datasets
        await censusApi.preloadCommonData();

        setProgress(100);
        setLoading(false);

        // Hide loader after showing completion
        setTimeout(() => {
          setShow(false);
          onComplete?.();
        }, 1000);
      } catch (err) {
        console.error('Preload error:', err);
        setError('Failed to preload some data. You can still use the app.');
        setLoading(false);

        // Hide error after 3 seconds
        setTimeout(() => {
          setShow(false);
          onComplete?.();
        }, 3000);
      }
    };

    preloadData();
  }, [onComplete]);

  return (
    <Collapse in={show}>
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 3,
        }}
      >
        <Box sx={{ p: 2 }}>
          {error ? (
            <Alert severity="warning" variant="filled">
              {error}
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {loading ? 'Loading Census data...' : '✓ Data loaded successfully!'}
              </Typography>
              <LinearProgress
                variant={loading ? 'indeterminate' : 'determinate'}
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                  },
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Collapse>
  );
};

export default DataPreloader;
