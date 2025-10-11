import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip, Container } from '@mui/material';
import { Brightness4, Brightness7, GitHub } from '@mui/icons-material';
import { useThemeMode } from '../../hooks/useThemeMode';

const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box
              sx={{
                fontSize: '2rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-5px)' },
                },
              }}
            >
              🇺🇸
            </Box>
            <Box>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(255,255,255,0.1)',
                }}
              >
                US Census Explorer
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Data Analytics Dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <Tooltip title="View on GitHub" arrow>
              <IconButton
                color="inherit"
                href="https://github.com/Vaporjawn/US-Census"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
