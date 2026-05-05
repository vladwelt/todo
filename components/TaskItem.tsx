import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../constants/theme';
import { formatDueDate, isDueOrOverdue } from '../lib/utils';
import type { Task } from '../types';

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle} hitSlop={8} style={styles.checkbox}>
        <MaterialIcons
          name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
          size={22}
          color={task.completed ? Colors.primary : Colors.checkboxBorder}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]} numberOfLines={2}>
          {task.title}
        </Text>

        {task.notes ? (
          <Text style={styles.meta} numberOfLines={1}>
            {task.notes}
          </Text>
        ) : null}

        {task.dueDate ? (
          <Text
            style={[
              styles.meta,
              !task.completed && isDueOrOverdue(task.dueDate) && styles.overdue,
            ]}
          >
            {formatDueDate(task.dueDate)}
          </Text>
        ) : null}

        {task.subtasks.length > 0 ? (
          <Text style={styles.meta}>
            {completedSubtasks}/{task.subtasks.length} subtasks
          </Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={onDelete} hitSlop={8}>
        <MaterialIcons name="close" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  checkbox: { marginRight: Spacing.sm, marginTop: 1 },
  content: { flex: 1 },
  title: { fontSize: FontSize.md, color: Colors.text },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textDisabled,
  },
  meta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  overdue: { color: Colors.danger },
});
