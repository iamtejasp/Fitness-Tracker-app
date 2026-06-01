import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { WorkoutCardSkeleton } from '@/components/Skeleton';
import { TextField } from '@/components/TextField';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteWorkoutsQuery, useWorkoutStatsQuery } from '@/hooks/useWorkouts';
import { Workout } from '@/types/api';

const exerciseFilters = [
  { label: 'All', value: undefined },
  { label: 'Bench', value: 'Bench Press' },
  { label: 'Squat', value: 'Squat' },
  { label: 'Deadlift', value: 'Deadlift' },
  { label: 'Pull-ups', value: 'Pull-ups' },
  { label: 'Press', value: 'Shoulder Press' },
] as const;

export default function WorkoutsScreen() {
  const [search, setSearch] = useState('');
  const [exercise, setExercise] = useState<string | undefined>();
  const debouncedSearch = useDebouncedValue(search.trim());
  const workoutsQuery = useInfiniteWorkoutsQuery({
    limit: 12,
    search: debouncedSearch || undefined,
    exercise,
  });
  const statsQuery = useWorkoutStatsQuery();
  const workouts = useMemo(
    () => workoutsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [workoutsQuery.data],
  );
  const total = workoutsQuery.data?.pages[0]?.total ?? 0;
  const isInitialLoading = workoutsQuery.isLoading;
  const isRefreshing = workoutsQuery.isRefetching && !workoutsQuery.isFetchingNextPage;

  function refresh() {
    statsQuery.refetch();
    workoutsQuery.refetch();
  }

  function loadNextPage() {
    if (workoutsQuery.hasNextPage && !workoutsQuery.isFetchingNextPage) {
      workoutsQuery.fetchNextPage();
    }
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={workouts}
        keyExtractor={(workout) => workout.id}
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <ListHeader
            exercise={exercise}
            search={search}
            shownCount={workouts.length}
            totalCount={total}
            workoutsThisWeek={statsQuery.data?.workoutsThisWeek ?? 0}
            onExerciseChange={setExercise}
            onSearchChange={setSearch}
          />
        }
        ListEmptyComponent={
          isInitialLoading ? (
            <LoadingRows />
          ) : workoutsQuery.isError ? (
            <ErrorState onRetry={() => workoutsQuery.refetch()} />
          ) : (
            <EmptyState
              title={debouncedSearch || exercise ? 'No matching workouts' : 'No workouts yet'}
              message={
                debouncedSearch || exercise
                  ? 'Try a different search or clear the selected filter.'
                  : 'Start by logging your first workout.'
              }
              action={debouncedSearch || exercise ? 'Clear filters' : 'Add your first workout'}
              onAction={() => {
                if (debouncedSearch || exercise) {
                  setSearch('');
                  setExercise(undefined);
                  return;
                }

                router.push('/(tabs)/add');
              }}
            />
          )
        }
        ListFooterComponent={
          workoutsQuery.isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : workouts.length > 0 && !workoutsQuery.hasNextPage ? (
            <Text style={styles.endText}>End of workout history</Text>
          ) : null
        }
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.45}
      />
    </Screen>
  );
}

interface ListHeaderProps {
  search: string;
  exercise?: string;
  workoutsThisWeek: number;
  shownCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onExerciseChange: (value: string | undefined) => void;
}

function ListHeader({
  search,
  exercise,
  workoutsThisWeek,
  shownCount,
  totalCount,
  onSearchChange,
  onExerciseChange,
}: ListHeaderProps) {
  return (
    <View>
      <AppHeader title="Workouts" subtitle="All logged sessions" />
      <TextField
        label="Search"
        placeholder="Search exercise name"
        value={search}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        returnKeyType="search"
      />
      <FlatList
        horizontal
        data={exerciseFilters}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => {
          const isActive = item.value === exercise;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter workouts by ${item.label}`}
              onPress={() => onExerciseChange(item.value)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}>
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{item.label}</Text>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.filters}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.summary}>
        <Ionicons name="trending-up" size={20} color={colors.primary} />
        <Text style={styles.summaryText}>
          {workoutsThisWeek} workouts this week • {shownCount} of {totalCount} shown
        </Text>
      </View>
    </View>
  );
}

function LoadingRows() {
  return (
    <View style={styles.loadingRows}>
      <WorkoutCardSkeleton />
      <WorkoutCardSkeleton />
      <WorkoutCardSkeleton />
      <WorkoutCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 130,
  },
  filters: {
    gap: 10,
    paddingVertical: 16,
  },
  filterChip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: colors.background,
    fontWeight: '900',
  },
  summary: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    padding: 14,
  },
  summaryText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  separator: {
    height: 12,
  },
  loadingRows: {
    gap: 12,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  endText: {
    color: colors.subtle,
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
