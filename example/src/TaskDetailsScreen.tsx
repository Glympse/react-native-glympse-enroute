import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type RouteProp } from '@react-navigation/native';
import type Task from '../../src/types/Task';
import { type RootStackParamList } from './App';
import EnRouteWrapper from './EnRouteWrapper';

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetailsScreen'>;

interface Props {
  route: TaskDetailsRouteProp;
}

const TaskDetailsScreen: React.FC<Props> = ({ route }) => {
  const { taskId } : { taskId: number } = route.params;
  const [task, setTask] = React.useState<Task | null>();

  useEffect(() => {
    const loadTask = async () => {
      const taskData = await EnRouteWrapper.instance().getEnRoute().taskManager.findTaskById(taskId);
      setTask(taskData);
    };
    
    loadTask();
  }, [taskId]);

  const formatTime = (epoch: number) => {
    if (!epoch || epoch <= 0) {
      return "Not set";
    }
    const date = new Date(epoch);
    return date.toLocaleString();
  };

  const formatEta = (msFromNow: number) => {
    if (!msFromNow || msFromNow <= 0) {
      return "Not set";
    }
    const date = new Date();
    date.setTime(date.getTime() + msFromNow);
    return date.toLocaleTimeString();
  }

  enum TravelMode {
      "Drive" = 0,
      "Transit" = 1,
      "Bike" = 2,
      "Walk" = 3
    }

  const InfoRow = ({ label, value, isLast = false }: { label: string; value: string | number; isLast?: boolean }) => (
    <View style={[styles.infoRow, isLast && styles.noBorder]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {task ?       
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.idText}>Task #{task.id}</Text>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseText}>{task.phase}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <InfoRow label="Description" value={task.description} />
          {task.operation.ticket.destination ? <InfoRow label="Destination" value={task.operation.ticket.destination.name} /> : null}
          {task.operation.ticket.destination ? <InfoRow label="Location" value={`${task.operation.ticket.destination.latitude}, ${task.operation.ticket.destination.longitude}`} /> : null}
          <InfoRow label="Agent ID" value={task.agentId} />
          <InfoRow label="Foreign ID" value={task.foreignId} isLast />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <InfoRow label="Due Time" value={formatTime(task.dueTime)} />
          <InfoRow label="Arrived Time" value={formatTime(task.arrivedTime)} />
          <InfoRow label="Completed Time" value={formatTime(task.completedTime)} isLast />
        </View>

        {task.operation ? 
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Operation</Text>
            <InfoRow label="Operation ID" value={task.operation.id} />
            <InfoRow label="State" value={task.operation.state} />
            <InfoRow label="Start Time" value={formatTime(task.operation.startTime)} isLast />
          </View>
        : null }

        {task.operation.ticket ?
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ticket</Text>
            <InfoRow label="Ticket ID" value={task.operation.ticket.id} />
            <InfoRow label="Travel Mode" value={TravelMode[task.operation.ticket.travelMode] || 'Unknown'} />
            <InfoRow label="ETA" value={formatEta(task.operation.ticket.eta)} />
            {task.operation.ticket.track ? <InfoRow label="Track distance" value={`${task.operation.ticket.track.distance}m`} /> : null}
            {task.operation.ticket.route ? <InfoRow label="Route distance" value={`${task.operation.ticket.route.distance}m`} /> : null}
            <InfoRow label="Visibility" value={task.operation.ticket.visibility} isLast />
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => EnRouteWrapper.instance().getEnRoute().taskManager.getTicketWithFullLocationArray(task.id).then(updatedTicket => {
                // Location arrays are not included in the ticket returned by findTaskById for performance reasons, so we need to fetch the full ticket to get location tracks.
                // Once we have the updated ticket, we can update the task state to trigger a re-render and show the location tracks if rendering a map.
                if (updatedTicket) {
                  const updatedTask = { ...task, operation: { ...task.operation, ticket: updatedTicket } };
                  setTask(updatedTask);
                }
              })}>
              <Text style={styles.buttonText}>Refresh Ticket Location Tracks</Text>
            </TouchableOpacity>
          </View>
        : null }

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Metadata</Text>
          {task.metadata.length > 0 ? (
            task.metadata.map((item, index) => (
              <InfoRow key={index} label={`Key: ${item.name}`} value={`Value: ${item.value}`} isLast={index === task.metadata.length - 1} />
            ))
          ) : (
            <Text style={{ fontSize: 14, color: '#666' }}>No metadata available.</Text>
          )}
        </View>

      </ScrollView>
      : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666' }}>Loading...</Text>
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
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
  idText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  phaseBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  phaseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8e8e93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    color: '#4a4a4a',
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 2,
    textAlign: 'right',
  },
});

export default TaskDetailsScreen;
