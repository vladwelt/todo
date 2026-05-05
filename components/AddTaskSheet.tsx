import React, { forwardRef, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTasksStore } from '../store/tasks';
import { Colors, Spacing, FontSize } from '../constants/theme';

interface Props {
  listId: string;
}

export const AddTaskSheet = forwardRef<BottomSheet, Props>(({ listId }, ref) => {
  const { addTask } = useTasksStore();
  const [title, setTitle] = useState('');

  const handleAdd = useCallback(() => {
    if (!title.trim()) return;
    addTask({ listId, title: title.trim() });
    setTitle('');
    Keyboard.dismiss();
    (ref as React.RefObject<BottomSheet>)?.current?.close();
  }, [title, listId, addTask, ref]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['40%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.sheetTitle}>New task</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          placeholderTextColor={Colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
            onPress={handleAdd}
            disabled={!title.trim()}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

AddTaskSheet.displayName = 'AddTaskSheet';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sheetTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: FontSize.lg,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 4,
  },
  saveBtnDisabled: { backgroundColor: Colors.checkboxBorder },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.md },
});
