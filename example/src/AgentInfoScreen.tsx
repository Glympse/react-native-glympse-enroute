import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnRouteWrapper from './EnRouteWrapper';
import type Agent from '../../src/types/Agent';
import NativeGlympseEnroute from '../../src/NativeGlympseEnroute';

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string | number;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, isLast && styles.noBorder]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? 'N/A'}</Text>
  </View>
);

const AgentInfoScreen = () => {
  const [agent, setAgent] = React.useState<Agent | null>();

  const { LOGOUT_REASON_USER_ACTION } = NativeGlympseEnroute.getConstants();

  useEffect(() => {
    const loadAgent = async () => {
      const agentData = await EnRouteWrapper.instance()
        .getEnRoute()
        .getSelfAgent();
      setAgent(agentData);
    };

    loadAgent();
  }, []);

  const formatRoles = (roles: string[]) => {
    if (!roles || roles.length === 0) {
      return 'N/A';
    }
    return roles.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      {agent ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={styles.idText}>Agent #{agent.id}</Text>
          </View>

          <Image
            style={styles.avatar}
            source={{
              uri: agent.avatarUrl,
            }}
          />

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <InfoRow label="Display Name" value={agent.displayName} />
            <InfoRow label="Name" value={agent.name} />
            <InfoRow label="Email" value={agent.email} />
            <InfoRow label="Roles" value={formatRoles(agent.roles)} isLast />
          </View>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              EnRouteWrapper.instance()
                .getEnRoute()
                .logout(LOGOUT_REASON_USER_ACTION)
            }
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  idText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AgentInfoScreen;
