import { TurboModuleRegistry, type CodegenTypes, type TurboModule } from 'react-native';
import type Organization from './types/Organization';
import type Agent from './types/Agent';

export type EnRouteEvent = {
  listener: number,
  events: number,
  obj1: Object,
  obj2: Object
}

export interface Spec extends TurboModule {
  initModule(): void;
  start(): void;
  stop(): void;
  isStarted(): Promise<boolean>;
  setActive(active: boolean): void;
  isLoginNeeded(): Promise<boolean>;
  setAuthenticationMode(mode: number): void;
  loginWithCredentials(username: string, password: string): Promise<boolean>;
  loginWithToken(token: string, expires_in: number): Promise<boolean>;
  logout(reason: number): void;
  overrideLoggingLevel(level: number): void;
  refresh(): void;
  registerDeviceToken(token: string): void;
  handleRemoteNotification(payload: string): void;
  getOrganization(): Promise<Organization | null>;
  getSelfAgent(): Promise<Agent | null>;

  /** Event Emitter */
  readonly onEnRouteEvent: CodegenTypes.EventEmitter<EnRouteEvent>;

  getConstants(): {
    // Authentication modes
    AUTH_MODE_NONE: number;
    AUTH_MODE_CREDENTIALS: number;
    AUTH_MODE_TOKEN: number;

    // Task states
    TASK_STATE_CREATED: number;
    TASK_STATE_STARTING: number;
    TASK_STATE_STARTED: number;
    TASK_STATE_FAILED_TO_START: number;
    TASK_STATE_COMPLETED: number;

    // Operation states
    OPERATION_STATE_ACTIVE: number;
    OPERATION_STATE_COMPLETING: number;
    OPERATION_STATE_COMPLETE: number;
    OPERATION_STATE_FAILED_TO_COMPLETE: number;

    // Logout reasons
    LOGOUT_REASON_UNKNOWN: number;
    LOGOUT_REASON_USER_ACTION: number;
    LOGOUT_REASON_OLD_VERSION: number;
    LOGOUT_REASON_INVALID_CREDENTIALS: number;
    LOGOUT_REASON_INVALID_TOKEN: number;
    LOGOUT_REASON_LOCATION_SERVICES_UNAVAILABLE: number;
    LOGOUT_REASON_SERVER_ERROR: number;
    LOGOUT_REASON_INVALID_SUBSCRIPTION: number;
    LOGOUT_REASON_APP_FLAVOR_MISMATCH: number;

    // Task completion reasons
    TASK_COMPLETE_REASON_UNKNOWN: number;
    TASK_COMPLETE_REASON_MANUAL_ARRIVAL: number;
    TASK_COMPLETE_REASON_ARRIVAL_DETECTED: number;
    TASK_COMPLETE_REASON_CANCELLED: number;
    TASK_COMPLETE_REASON_TICKET_EXPIRED: number;
    TASK_COMPLETE_REASON_TASK_REMOVED: number;
    TASK_COMPLETE_REASON_DEPARTURE_DETECTED: number;

    // Session completion reasons
    SESSION_COMPLETION_REASON_UNKNOWN: number;
    SESSION_COMPLETION_REASON_GEOFENCE: number;
    SESSION_COMPLETION_REASON_USER_ACTION: number;

    // Ticket extension constants
    TICKET_EXTEND_CHECK: number;
    TICKET_EXTEND_CUTOFF: number;
    TICKET_EXTEND_LENGTH: number;

    // ETA constants
    MINIMUM_MANUAL_ETA: number;

    // Diagnostics constants
    DIAGNOSTICS_COLLECTOR_MAX_CAPACITY: number;
    DIAGNOSTICS_COLLECTOR_UPLOAD_DELAY_MS: number;

    // Index constants
    INDEX_BEFORE: number;
    INDEX_AFTER: number;

    // Session states
    SESSION_STATE_UNKNOWN: number;
    SESSION_STATE_CREATED: number;
    SESSION_STATE_STARTING: number;
    SESSION_STATE_STARTED: number;
    SESSION_STATE_COMPLETING: number;
    SESSION_STATE_COMPLETED: number;

    // Batch constants
    BATCH_MAXIMUM_ENDPOINTS: number;

    // Minimum auto refresh period
    MINIMUM_AUTO_REFRESH_PERIOD: number;

    // Thresholds
    PICKUP_COMPLETED_KEEP_THRESHOLD_MS: number;
    TASK_COMPLETED_KEEP_THRESHOLD_MS: number;
    TASK_LOOKAHEAD_FOR_AUTO_COMPLETE_MS: number;

    // Phase properties
    PHASE_PROPERTY_KEY: string;
    PHASE_PROPERTY_UNKNOWN: string;
    PHASE_PROPERTY_PRE: string;
    PHASE_PROPERTY_ETA: string;
    PHASE_PROPERTY_NEW: string;
    PHASE_PROPERTY_LIVE: string;
    PHASE_PROPERTY_ARRIVED: string;
    PHASE_PROPERTY_FEEDBACK: string;
    PHASE_PROPERTY_COMPLETING: string;
    PHASE_PROPERTY_COMPLETED: string;
    PHASE_PROPERTY_NOT_COMPLETED: string;
    PHASE_PROPERTY_CANCELLED: string;
    PHASE_PROPERTY_READY: string;
    PHASE_PROPERTY_SCHEDULED: string;
    PHASE_PROPERTY_QUASI: string;

    // Pickup remote trigger names
    PICKUP_TRIGGER_GEOFENCE: string;
    PICKUP_TRIGGER_ETA: string;

    // Session control modes
    SESSION_CONTROL_MODE_MANUAL: string;
    SESSION_CONTROL_MODE_SHUTTLE_SERVICE: string;
    SESSION_CONTROL_MODE_FOOD_DELIVERY: string;

    // Travel modes
    TRAVEL_MODE_DRIVING: string;
    TRAVEL_MODE_WALKING: string;
    TRAVEL_MODE_TRANSIT: string;
    TRAVEL_MODE_BICYCLE: string;

    // Confirmation Image modes
    CONFIRMATION_IMAGE_NONE: string;
    CONFIRMATION_IMAGE_SIGNATURE: string;
    CONFIRMATION_IMAGE_PHOTO: string;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('GlympseEnroute');
