import { Colors } from '../../constants/Colors';

describe('Colors Constants', () => {
  describe('Light Theme', () => {
    it('should have all required color properties', () => {
      const lightColors = Colors.light;
      
      expect(lightColors).toHaveProperty('text');
      expect(lightColors).toHaveProperty('background');
      expect(lightColors).toHaveProperty('tint');
      expect(lightColors).toHaveProperty('icon');
      expect(lightColors).toHaveProperty('tabIconDefault');
      expect(lightColors).toHaveProperty('tabIconSelected');
      expect(lightColors).toHaveProperty('primary');
      expect(lightColors).toHaveProperty('secondary');
      expect(lightColors).toHaveProperty('accent');
      expect(lightColors).toHaveProperty('navbar');
      expect(lightColors).toHaveProperty('tabbar');
      expect(lightColors).toHaveProperty('surface');
      expect(lightColors).toHaveProperty('success');
      expect(lightColors).toHaveProperty('warning');
      expect(lightColors).toHaveProperty('error');
      expect(lightColors).toHaveProperty('border');
      expect(lightColors).toHaveProperty('placeholder');
    });

    it('should have correct Caixa brand colors', () => {
      const lightColors = Colors.light;
      
      expect(lightColors.primary).toBe('#1c60ab'); // Caixa blue
      expect(lightColors.secondary).toBe('#ef9c00'); // Caixa orange
      expect(lightColors.background).toBe('#FFFFFF'); // White background
      expect(lightColors.success).toBe('#28A745'); // Success green
      expect(lightColors.error).toBe('#DC3545'); // Error red
    });

    it('should have valid hex color formats', () => {
      const lightColors = Colors.light;
      
      Object.values(lightColors).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/);
      });
    });
  });

  describe('Dark Theme', () => {
    it('should have all required color properties', () => {
      const darkColors = Colors.dark;
      
      expect(darkColors).toHaveProperty('text');
      expect(darkColors).toHaveProperty('background');
      expect(darkColors).toHaveProperty('tint');
      expect(darkColors).toHaveProperty('icon');
      expect(darkColors).toHaveProperty('tabIconDefault');
      expect(darkColors).toHaveProperty('tabIconSelected');
      expect(darkColors).toHaveProperty('primary');
      expect(darkColors).toHaveProperty('secondary');
      expect(darkColors).toHaveProperty('accent');
      expect(darkColors).toHaveProperty('navbar');
      expect(darkColors).toHaveProperty('tabbar');
      expect(darkColors).toHaveProperty('surface');
      expect(darkColors).toHaveProperty('success');
      expect(darkColors).toHaveProperty('warning');
      expect(darkColors).toHaveProperty('error');
      expect(darkColors).toHaveProperty('border');
      expect(darkColors).toHaveProperty('placeholder');
    });

    it('should have appropriate dark theme colors', () => {
      const darkColors = Colors.dark;
      
      expect(darkColors.text).toBe('#FFFFFF'); // White text for dark theme
      expect(darkColors.background).toBe('#1A1A1A'); // Dark background
      expect(darkColors.secondary).toBe('#ef9c00'); // Caixa orange (same as light)
    });

    it('should have valid hex color formats', () => {
      const darkColors = Colors.dark;
      
      Object.values(darkColors).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/);
      });
    });
  });

  describe('Theme Consistency', () => {
    it('should have same keys in both light and dark themes', () => {
      const lightKeys = Object.keys(Colors.light).sort();
      const darkKeys = Object.keys(Colors.dark).sort();
      
      expect(lightKeys).toEqual(darkKeys);
    });

    it('should maintain brand consistency across themes', () => {
      // Orange should be the same in both themes (brand color)
      expect(Colors.light.secondary).toBe(Colors.dark.secondary);
      expect(Colors.light.warning).toBe(Colors.dark.warning);
      
      // Success color should be consistent
      expect(Colors.light.success).toBe(Colors.dark.success);
    });
  });

  describe('Accessibility', () => {
    it('should provide sufficient contrast between text and background', () => {
      // Light theme: dark text on white background
      expect(Colors.light.text).toBe('#333333');
      expect(Colors.light.background).toBe('#FFFFFF');
      
      // Dark theme: white text on dark background
      expect(Colors.dark.text).toBe('#FFFFFF');
      expect(Colors.dark.background).toBe('#1A1A1A');
    });

    it('should have distinguishable status colors', () => {
      const lightColors = Colors.light;
      
      expect(lightColors.success).not.toBe(lightColors.warning);
      expect(lightColors.success).not.toBe(lightColors.error);
      expect(lightColors.warning).not.toBe(lightColors.error);
    });
  });
});