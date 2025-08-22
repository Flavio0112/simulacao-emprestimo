import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInputProps, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  applyCurrencyMask,
  parseCurrency,
  validateCurrencyAmount,
  getCurrencySymbol,
  CURRENCY_CONSTRAINTS,
} from '@/utils/currency';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onValueChange?: (value: number) => void;
  error?: string;
  containerStyle?: any;
  showSymbol?: boolean;
  placeholder?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value = '',
  onChangeText,
  onValueChange,
  error,
  containerStyle,
  style,
  showSymbol = true,
  placeholder = '0,00',
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const inputRef = useRef<TextInput>(null);
  
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    // Apply currency mask
    const maskedValue = applyCurrencyMask(text);
    
    // Validate length constraint
    if (maskedValue.length > CURRENCY_CONSTRAINTS.MAX_INPUT_LENGTH) {
      return;
    }
    
    setLocalValue(maskedValue);
    
    // Call callbacks
    if (onChangeText) {
      onChangeText(maskedValue);
    }
    
    if (onValueChange) {
      const numericValue = parseCurrency(maskedValue);
      onValueChange(numericValue);
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    
    // Validate on blur
    const validation = validateCurrencyAmount(localValue);
    if (!validation.isValid && localValue) {
      // Optionally show validation error
    }
    
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // Sync with external value changes
  React.useEffect(() => {
    if (value !== localValue) {
      const maskedValue = applyCurrencyMask(value);
      setLocalValue(maskedValue);
    }
  }, [value]);

  const displayValue = localValue || (isFocused ? '' : '');
  const hasError = !!error;
  const currencySymbol = getCurrencySymbol();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.background,
          borderColor: hasError ? colors.error : 
                       isFocused ? colors.primary : colors.border,
        }
      ]}>
        {showSymbol && (
          <View style={styles.symbolContainer}>
            <Text style={[styles.symbol, { color: colors.text }]}>
              {currencySymbol}
            </Text>
          </View>
        )}
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: colors.text,
              flex: showSymbol ? 1 : undefined,
            },
            style,
          ]}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={CURRENCY_CONSTRAINTS.MAX_INPUT_LENGTH}
          selectTextOnFocus
          {...props}
        />
      </View>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
      
      {!error && !isFocused && localValue && (
        <Text style={[styles.hint, { color: colors.placeholder }]}>
          Toque para editar
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  symbolContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'right',
    minHeight: 44,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
});