import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Brightness4, Brightness7, GitHub } from '@mui/icons-material';
import { useThemeMode } from '../../hooks/useThemeMode';

const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          🇺🇸 US Census Data Explorer
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="View on GitHub">
            <IconButton
              color="inherit"
              href="https://github.com/Vaporjawn/US-Census"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
