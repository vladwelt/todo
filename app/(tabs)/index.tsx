import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useTasksStore } from '../../store/tasks';
import { useTaskList } from '../../hooks/useTaskList';
import { TaskItem } from '../../components/TaskItem';
import { FAB } from '../../components/FAB';
import { AddTaskSheet } from '../../components/AddTaskSheet';
import { EmptyState } from '../../components/EmptyState';
import { Colors, Spacing, FontSize } from '../../constants/theme';
import type { Task } from '../../types';

export default function TasksScreen() {
  const { toggleTask, deleteTask } = useTasksStore();
  const { activeList, activeTasks, completedTasks, activeListId } = useTaskList();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const visibleData: Task[] = showCompleted
    ? [...activeTasks, ...completedTasks]
    : activeTasks;

  const openAddSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeList?.title ?? 'My Tasks'}</Text>
        <MaterialIcons name="more-vert" size={24} color={Colors.text} />
      </View>

      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState listTitle={activeList?.title ?? 'My Tasks'} />
        }
        ListFooterComponent={
          completedTasks.length > 0 ? (
            <TouchableOpacity
              style={styles.completedToggle}
              onPress={() => setShowCompleted((v) => !v)}
            >
              <MaterialIcons
                name={showCompleted ? 'expand-less' : 'expand-more'}
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.completedLabel}>
                Completed ({completedTasks.length})
              </Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={visibleData.length === 0 ? styles.emptyContent : styles.listContent}
      />

      <FAB onPress={openAddSheet} />
      <AddTaskSheet ref={bottomSheetRef} listId={activeListId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '500',
    color: Colors.text,
  },
  listContent: { paddingBottom: 88 },
  emptyContent: { flex: 1 },
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  completedLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
