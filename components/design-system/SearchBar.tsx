import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Searchbar } from 'react-native-paper';
import theme from '@/constants/DesignTokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder || '搜索...'}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchbar}
        inputStyle={styles.input}
        iconColor={theme.colors.textTertiary}
        placeholderTextColor={theme.colors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.elevation.sm,
  },
  input: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
});

