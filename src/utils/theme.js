import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E3A8A', // Deep blue
    secondary: '#F59E0B', // Amber
    accent: '#10B981', // Emerald
    background: '#F8FAFC', // Light gray
    surface: '#FFFFFF',
    text: '#1F2937', // Dark gray
    placeholder: '#9CA3AF', // Medium gray
    disabled: '#D1D5DB', // Light gray
    error: '#EF4444', // Red
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue
    // Custom colors for fitness app
    fitness: {
      strength: '#DC2626', // Red
      endurance: '#059669', // Green
      speed: '#7C3AED', // Purple
      agility: '#EA580C', // Orange
      flexibility: '#0891B2', // Cyan
      power: '#BE185D', // Pink
    },
    gradients: {
      primary: ['#1E3A8A', '#3B82F6'],
      secondary: ['#F59E0B', '#FBBF24'],
      success: ['#10B981', '#34D399'],
      warning: ['#F59E0B', '#FCD34D'],
      error: ['#EF4444', '#F87171'],
    }
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  roundness: 12,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};
