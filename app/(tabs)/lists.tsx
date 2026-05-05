import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useListsStore } from '../../store/lists';
import { useTasksStore } from '../../store/tasks';
import { Colors, Spacing, FontSize } from '../../constants/theme';

export default function ListsScreen() {
  const { lists, addList, deleteList, setActiveList } = useListsStore();
  const { tasks, deleteTasksByList } = useTasksStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim());
      setNewListTitle('');
      setIsAdding(false);
    }
  };

  const handleDeleteList = (id: string, title: string) => {
    Alert.alert('Delete list', `Delete "${title}" and all its tasks?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTasksByList(id);
          deleteList(id);
        },
      },
    ]);
  };

  const handleSelectList = (id: string) => {
    setActiveList(id);
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lists</Text>
        <TouchableOpacity onPress={() => setIsAdding(true)} hitSlop={8}>
          <MaterialIcons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="List name"
            placeholderTextColor={Colors.textSecondary}
            value={newListTitle}
            onChangeText={setNewListTitle}
            autoFocus
            onSubmitEditing={handleAddList}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={handleAddList} style={styles.rowBtn}>
            <Text style={styles.rowBtnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAdding(false)} style={styles.rowBtn}>
            <Text style={[styles.rowBtnText, { color: Colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const activeCount = tasks.filter(
            (t) => t.listId === item.id && !t.completed
          ).length;
          return (
            <TouchableOpacity style={styles.listRow} onPress={() => handleSelectList(item.id)}>
              <MaterialIcons name="list" size={24} color={Colors.primary} />
              <Text style={styles.listTitle}>{item.title}</Text>
              {activeCount > 0 && (
                <Text style={styles.count}>{activeCount}</Text>
              )}
              {item.id !== 'default' && (
                <TouchableOpacity
                  onPress={() => handleDeleteList(item.id, item.title)}
                  hitSlop={8}
                >
                  <MaterialIcons name="delete-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: Spacing.xs,
  },
  rowBtn: { paddingHorizontal: Spacing.sm },
  rowBtnText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '500' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  listTitle: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  count: { fontSize: FontSize.sm, color: Colors.textSecondary },
  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginLeft: Spacing.md * 2 + 24,
  },
});
