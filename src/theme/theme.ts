import { createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// American-themed color palette
const americanColors = {
  navyBlue: '#003366',
  richNavy: '#001f3f',
  patriotRed: '#B22234',
  crimsonRed: '#DC143C',
  starWhite: '#FFFFFF',
  creamWhite: '#F8F9FA',
  goldAccent: '#FFD700',
  silverGray: '#C0C0C0',
};

const getTheme = (mode: PaletteMode): Theme => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode - Patriotic American theme
          primary: {
            main: americanColors.navyBlue,
            light: '#1a4d7a',
            dark: americanColors.richNavy,
            contrastText: '#ffffff',
          },
          secondary: {
            main: americanColors.patriotRed,
            light: '#d13a4a',
            dark: '#8b1a29',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f0f2f5',
            paper: americanColors.starWhite,
          },
          text: {
            primary: '#1a1a1a',
            secondary: '#4a5568',
          },
          divider: 'rgba(0, 51, 102, 0.12)',
          info: {
            main: '#2563eb',
            light: '#60a5fa',
            dark: '#1e40af',
          },
          success: {
            main: '#059669',
            light: '#34d399',
            dark: '#047857',
          },
          warning: {
            main: americanColors.goldAccent,
            light: '#fde047',
            dark: '#ca8a04',
          },
        }
      : {
          // Dark mode - Elegant American night theme
          primary: {
            main: '#4a90e2',
            light: '#6ba3e8',
            dark: '#2a5a9e',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
            contrastText: '#ffffff',
          },
          background: {
            default: '#0f172a',
            paper: '#1e293b',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
          },
          divider: 'rgba(148, 163, 184, 0.12)',
          info: {
            main: '#60a5fa',
            light: '#93c5fd',
            dark: '#3b82f6',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'light' ? '#cbd5e1 #f1f5f9' : '#475569 #1e293b',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'light' ? '#f1f5f9' : '#1e293b',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'light' ? '#cbd5e1' : '#475569',
            borderRadius: '4px',
            '&:hover': {
              background: mode === 'light' ? '#94a3b8' : '#64748b',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'dark'
            ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 10px 40px rgba(0, 51, 102, 0.08), 0 4px 12px rgba(0, 51, 102, 0.04)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'dark'
              ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4)'
              : '0 20px 60px rgba(0, 51, 102, 0.12), 0 8px 20px rgba(0, 51, 102, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 51, 102, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0 6px 20px rgba(0, 0, 0, 0.4)'
              : '0 6px 20px rgba(0, 51, 102, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: mode === 'light'
            ? 'linear-gradient(135deg, #003366 0%, #001f3f 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(0, 51, 102, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 51, 102, 0.08)',
        },
        elevation2: {
          boxShadow: mode === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 51, 102, 0.1)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          minHeight: 64,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 51, 102, 0.04)',
          },
          '&.Mui-selected': {
            color: mode === 'light' ? americanColors.navyBlue : '#60a5fa',
            fontWeight: 700,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: mode === 'light' ? americanColors.patriotRed : '#ef4444',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? americanColors.navyBlue : '#4a90e2',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default getTheme;
