import EnRouteWrapper from './EnRouteWrapper';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  type EventSubscription,
  AppState,
  Platform,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import PushNotificationIOS, {
  type PushNotification,
} from '@react-native-community/push-notification-ios';
import LoginScreen from './LoginScreen';
import EnRouteEvents from '../../src/NativeEnRouteEvents';
import GlympseEnroute from '../../src/NativeGlympseEnroute';
import TasksScreen from './TasksScreen';
import TaskDetailsScreen from './TaskDetailsScreen';
import OrgInfoScreen from './OrgInfoScreen';
import AgentInfoScreen from './AgentInfoScreen';

export type RootStackParamList = {
  Tasks: undefined;
  Login: undefined;
  TaskDetailsScreen: { taskId: number };
  OrgInfo: undefined;
  AgentInfo: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const listenerSubscription = useRef<null | EventSubscription>(null);

  useEffect(() => {
    // Initialize EnRoute and check login status
    EnRouteWrapper.instance().initAndStart();
    EnRouteWrapper.instance()
      .getEnRoute()
      .isLoginNeeded()
      .then((loginNeeded) => {
        if (loginNeeded) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
        setIsLoading(false);
      });

    // Subscribe to state changes
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'active') {
          EnRouteWrapper.instance().getEnRoute().setActive(true);
        }
        if (nextAppState === 'background') {
          EnRouteWrapper.instance().getEnRoute().setActive(false);
        }
      }
    );

    // Push notification registration
    // iOS requires passing along the device token and messages from AppDelegate,
    // but Android is handled fully by the EnRoute SDK and Firebase messaging
    if (Platform.OS === 'ios') {
      const onPushRegister = (token: string) => {
        console.log('Push notification token registered:', token);
        EnRouteWrapper.instance().getEnRoute().registerDeviceToken(token);
      };
      PushNotificationIOS.addEventListener('register', onPushRegister);

      const onRemoteNotification = (notification: PushNotification) => {
        console.log('Push notification received:', notification);
        const data = notification.getData();
        const payload = data?.payload;
        if (payload) {
          EnRouteWrapper.instance()
            .getEnRoute()
            .handleRemoteNotification(payload);
        }
        const result = PushNotificationIOS.FetchResult.NewData;
        notification.finish(result);
      };
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotification
      );
    }

    // Setup event listener to detect login events
    const {
      LISTENER_ENROUTE_MANAGER,
      ENROUTE_MANAGER_SYNCED,
      ENROUTE_MANAGER_AUTHENTICATION_NEEDED,
      ENROUTE_MANAGER_LOGGED_OUT,
    } = EnRouteEvents.getConstants();

    listenerSubscription.current = GlympseEnroute.onEnRouteEvent(
      (glympseEvent) => {
        console.log('event in App', glympseEvent);
        if (glympseEvent.listener === LISTENER_ENROUTE_MANAGER) {
          if ((glympseEvent.events & ENROUTE_MANAGER_SYNCED) !== 0) {
            // Show Tasks screen
            setIsLoggedIn(true);
            setIsLoading(false);
          } else if (
            (glympseEvent.events & ENROUTE_MANAGER_AUTHENTICATION_NEEDED) !==
            0
          ) {
            // Show login screen
            setIsLoggedIn(false);
            setIsLoading(false);
          } else if ((glympseEvent.events & ENROUTE_MANAGER_LOGGED_OUT) !== 0) {
            setIsLoggedIn(false);
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
      appStateSubscription.remove();
      if (Platform.OS === 'ios') {
        PushNotificationIOS.removeEventListener('register');
        PushNotificationIOS.removeEventListener('notification');
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size="large" color="#0070E0" />
      </View>
    );
  }

  return (
    <ActionSheetProvider useCustomActionSheet={true}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Tasks" component={TasksScreen} />
              <Stack.Screen
                name="TaskDetailsScreen"
                component={TaskDetailsScreen}
                options={{ title: 'Task Details' }}
              />
              <Stack.Screen
                name="OrgInfo"
                component={OrgInfoScreen}
                options={{ title: 'Organization Info' }}
              />
              <Stack.Screen
                name="AgentInfo"
                component={AgentInfoScreen}
                options={{ title: 'Agent Info' }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
