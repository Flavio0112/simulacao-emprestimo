/**
 * Caixa Econômica Federal color palette for the Personal Loan App
 * Colors follow Caixa's banking brand identity
 */

// Official Caixa Econômica Federal brand colors
const caixaBlue = '#1c60ab';        // Primary blue (buttons/accent)
const caixaOrange = '#ef9c00';      // Secondary orange (buttons)
const caixaLightBlue = '#E3F2FD';   // Light blue (navbar/headers)
const caixaNavbarBlue = '#B3D9FF';  // Navbar background
const caixaCream = '#F9F7F4';       // Tab bar background (cream/beige)
const caixaGray = '#666666';
const caixaLightGray = '#F5F5F5';
const caixaDarkGray = '#333333';

export const Colors = {
  light: {
    text: caixaDarkGray,
    background: '#FFFFFF',
    tint: caixaBlue,
    icon: caixaGray,
    tabIconDefault: caixaGray,
    tabIconSelected: caixaBlue,
    primary: caixaBlue,
    secondary: caixaOrange,
    accent: caixaLightBlue,
    navbar: caixaNavbarBlue,
    tabbar: caixaCream,
    surface: caixaLightGray,
    success: '#28A745',
    warning: caixaOrange,
    error: '#DC3545',
    border: '#E0E0E0',
    placeholder: '#999999',
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A1A',
    tint: caixaLightBlue,
    icon: '#CCCCCC',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: caixaLightBlue,
    primary: caixaLightBlue,
    secondary: caixaOrange,
    accent: '#66B2FF',
    navbar: '#2D3748',
    tabbar: '#2D2D2D',
    surface: '#2D2D2D',
    success: '#28A745',
    warning: caixaOrange,
    error: '#FF6B6B',
    border: '#404040',
    placeholder: '#AAAAAA',
  },
};
