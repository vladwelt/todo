import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../constants/theme';

interface Props {
  listTitle: string;
}

export function EmptyState({ listTitle }: Props) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle-outline" size={72} color={Colors.separator} />
      <Text style={styles.title}>Tasks for {listTitle}</Text>
      <Text style={styles.subtitle}>Tap + to add a task</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textDisabled,
  },
});
