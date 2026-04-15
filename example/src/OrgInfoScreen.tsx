import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnRouteWrapper from './EnRouteWrapper';
import type Organization from '../../src/types/Organization';

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string | number | boolean;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, isLast && styles.noBorder]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? 'N/A'}
    </Text>
  </View>
);

const OrgInfoScreen = () => {
  const [org, setOrg] = React.useState<Organization | null>();

  useEffect(() => {
    const loadOrg = async () => {
      const orgData = await EnRouteWrapper.instance()
        .getEnRoute()
        .getOrganization();
      setOrg(orgData);
    };

    loadOrg();
  }, []);

  const formatStringArray = (roles: string[]) => {
    if (!roles || roles.length === 0) {
      return 'N/A';
    }
    return roles.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      {org ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={styles.idText}>Organization #{org.id}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <InfoRow label="Name" value={org.name} />
            <InfoRow label="Referrer ID" value={org.referrerOrgId} />
            <InfoRow label="Admin Email" value={org.adminEmail} isLast />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Config</Text>
            <InfoRow
              label="Shifts Enabled"
              value={org.config.areShiftsEnabled}
            />
            <InfoRow label="Arrival Phase" value={org.config.arrivalPhase} />
            <InfoRow label="Branding ID" value={org.config.brandingId} />
            <InfoRow
              label="Completion Phases"
              value={formatStringArray(org.config.completionPhases)}
            />
            <InfoRow
              label="Default Travel Mode"
              value={org.config.defaultTravelMode}
            />
            <InfoRow label="Final Phase" value={org.config.finalPhase} />
            <InfoRow label="Initial Phase" value={org.config.initialPhase} />
            <InfoRow
              label="Initial Tracking Phase"
              value={org.config.initialTrackingPhase}
            />
            <InfoRow
              label="Photo Upload Enabled"
              value={org.config.isPhotoUploadEnabled}
            />
            <InfoRow label="Pickup Mode" value={org.config.isPickupMode} />
            <InfoRow label="Session Mode" value={org.config.isSessionMode} />
            <InfoRow
              label="Signature Upload Enabled"
              value={org.config.isSignatureUploadEnabled}
            />
            <InfoRow
              label="Picker Disabled Task Phases"
              value={formatStringArray(org.config.pickerDisabledTaskPhases)}
            />
          </View>
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

export default OrgInfoScreen;
