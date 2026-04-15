import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  type EventSubscription,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from '@react-native-vector-icons/fontawesome-free-solid';
import { useActionSheet } from '@expo/react-native-action-sheet';
import type Task from '../../src/types/Task';
import EnRouteEvents from '../../src/NativeEnRouteEvents';
import GlympseEnroute from '../../src/NativeGlympseEnroute';
import EnRouteWrapper from './EnRouteWrapper';
import NativeGlympseEnroute from '../../src/NativeGlympseEnroute';
import { requestPermissions } from './PermissionService';

const TasksScreen = ({ navigation }: any) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const {
    PHASE_PROPERTY_NEW,
    PHASE_PROPERTY_UNKNOWN,
    PHASE_PROPERTY_PRE,
    PHASE_PROPERTY_ETA,
    PHASE_PROPERTY_SCHEDULED,
    PHASE_PROPERTY_QUASI,
    PHASE_PROPERTY_READY,
    PHASE_PROPERTY_LIVE,
    PHASE_PROPERTY_ARRIVED,
    PHASE_PROPERTY_NOT_COMPLETED,
    TASK_STATE_COMPLETED,
  } = NativeGlympseEnroute.getConstants();

  const listenerSubscription = useRef<null | EventSubscription>(null);

  useEffect(() => {
    requestPermissions();
    updateTaskList();

    const {
      LISTENER_TASKS,
      TASKS_TASK_LIST_CHANGED,
      TASKS_TASK_PHASE_CHANGED,
    } = EnRouteEvents.getConstants();

    listenerSubscription.current = GlympseEnroute.onEnRouteEvent(
      (glympseEvent) => {
        console.log('event in TasksScreen', glympseEvent);
        if (glympseEvent.listener === LISTENER_TASKS) {
          if ((glympseEvent.events & TASKS_TASK_LIST_CHANGED) !== 0) {
            updateTaskList();
          }
          if ((glympseEvent.events & TASKS_TASK_PHASE_CHANGED) !== 0) {
            updateTaskList(); // Can be more specific and just update the changed task, but for simplicity we refresh the whole list here
          }
        }
      }
    );

    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    };
  }, []);

  const updateTaskList = () => {
    EnRouteWrapper.instance()
      .getEnRoute()
      .taskManager.getTasks()
      .then((updatedTasks) => {
        setTasks(updatedTasks);
      });
  };

  type ActionType =
    | 'START'
    | 'LIVE'
    | 'ARRIVE'
    | 'PAUSE'
    | 'COMPLETE'
    | 'CANCEL';

  interface TaskActionConfig {
    id: ActionType;
    label: string;
    isDestructive?: boolean;
  }

  const { showActionSheetWithOptions } = useActionSheet();
  const insets = useSafeAreaInsets();
  const handleActionMenu = (task: Task) => {
    const menuActions: TaskActionConfig[] = [];

    // Available actions depend on the current phase of the task
    if (
      task.phase === PHASE_PROPERTY_NEW ||
      task.phase === PHASE_PROPERTY_UNKNOWN
    ) {
      menuActions.push({ id: 'START', label: 'Start Task' });
    } else if (
      task.phase === PHASE_PROPERTY_PRE ||
      task.phase === PHASE_PROPERTY_ETA ||
      task.phase === PHASE_PROPERTY_SCHEDULED ||
      task.phase === PHASE_PROPERTY_QUASI ||
      task.phase === PHASE_PROPERTY_READY ||
      task.phase === PHASE_PROPERTY_NOT_COMPLETED
    ) {
      menuActions.push({ id: 'LIVE', label: 'Start Tracking' });
    } else if (task.phase === PHASE_PROPERTY_LIVE) {
      menuActions.push({ id: 'ARRIVE', label: 'Mark Arrived' });
      menuActions.push({ id: 'PAUSE', label: 'Pause Task' });
      menuActions.push({
        id: 'COMPLETE',
        label: 'Complete Task',
        isDestructive: true,
      });
    } else if (task.phase === PHASE_PROPERTY_ARRIVED) {
      menuActions.push({
        id: 'COMPLETE',
        label: 'Complete Task',
        isDestructive: true,
      });
    }

    const options = [...menuActions.map((a) => a.label), 'Cancel'];
    const destructiveButtonIndex = menuActions.findIndex(
      (a) => a.isDestructive
    );
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        containerStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        },
      },
      (selectedIndex?: number) => {
        if (
          selectedIndex === undefined ||
          selectedIndex === cancelButtonIndex
        ) {
          return;
        }

        const selectedAction = menuActions[selectedIndex];
        if (selectedAction) {
          performAction(selectedAction.id, task);
        }
      }
    );
  };

  const performAction = (actionId: ActionType, task: Task) => {
    switch (actionId) {
      case 'START':
        EnRouteWrapper.instance().getEnRoute().taskManager.startTask(task.id);
        break;
      case 'LIVE':
        EnRouteWrapper.instance()
          .getEnRoute()
          .taskManager.setTaskPhase(task.id, PHASE_PROPERTY_LIVE);
        break;
      case 'ARRIVE':
        EnRouteWrapper.instance()
          .getEnRoute()
          .taskManager.setTaskPhase(task.id, PHASE_PROPERTY_ARRIVED);
        break;
      case 'PAUSE':
        EnRouteWrapper.instance()
          .getEnRoute()
          .taskManager.setTaskPhase(task.id, PHASE_PROPERTY_NOT_COMPLETED);
        break;
      case 'COMPLETE':
        // Show confirmation since this is irreversible
        Alert.alert(
          'Complete Task',
          'Are you sure you want to mark this task as complete?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () =>
                EnRouteWrapper.instance()
                  .getEnRoute()
                  .taskManager.completeTask(task.id),
            },
          ]
        );
        break;
    }
  };

  const renderHeader = () => (
    <View style={styles.headerButtonsContainer}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.navigate('OrgInfo')}
      >
        <Text style={styles.buttonText}>Org Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.navigate('AgentInfo')}
      >
        <Text style={styles.buttonText}>Agent Info</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: Task }) => {
    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() =>
          navigation.navigate('TaskDetailsScreen', { taskId: item.id })
        }
      >
        <View style={styles.taskInfo}>
          <Text style={styles.descriptionText}>
            {item.description || 'No Description'}
          </Text>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseText}>{item.phase}</Text>
          </View>
        </View>

        {item.state !== TASK_STATE_COMPLETED ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleActionMenu(item)}
          >
            <FontAwesomeFreeSolid
              name="ellipsis-vertical"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderHeader()}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  headerButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskInfo: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 6,
  },
  phaseBadge: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  phaseText: {
    fontSize: 12,
    color: '#0288d1',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  menuButton: {
    padding: 10,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});

export default TasksScreen;
