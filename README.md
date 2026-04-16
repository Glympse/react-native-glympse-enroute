# @glympse-inc/react-native-glympse-enroute

React Native wrapper for Glympse En Route SDK

## Installation

Install the package as usual in your React Native app:

```bash
npm install @glympse-inc/react-native-glympse-enroute
# or
yarn add @glympse-inc/react-native-glympse-enroute
```

Follow the native installation steps for iOS/Android if your project requires manual linking.

## Quickstart / Initialization

Wrap the native SDK initialization in a small helper as shown in the example. The example uses `EnRouteWrapper` which performs initialization and starts the SDK:

```ts
// example/src/EnRouteWrapper.tsx
import EnRoute from '@glympse-inc/react-native-glympse-enroute';
import GlympseEnroute from '../../src/NativeGlympseEnroute';

export default class EnRouteWrapper {
  static myInstance: EnRouteWrapper;
  _enroute: EnRoute;

  static instance() {
    if (!EnRouteWrapper.myInstance) {
      EnRouteWrapper.myInstance = new EnRouteWrapper();
    }
    return EnRouteWrapper.myInstance;
  }

  constructor() {
    this._enroute = new EnRoute();
  }

  initAndStart() {
    const { AUTH_MODE_CREDENTIALS } = GlympseEnroute.getConstants();

    this._enroute.initModule();
    this._enroute.overrideLoggingLevel(1);
    this._enroute.setAuthenticationMode(AUTH_MODE_CREDENTIALS);
    this._enroute.start();
  }

  getEnRoute() {
    return this._enroute;
  }

  loginWithCredentials(username: string, password: string) {
    this._enroute.isStarted().then((started) => {
      if (!started) {
        this.initAndStart();
      }
      this._enroute.loginWithCredentials(username, password);
    });
  }
}
```

Call `EnRouteWrapper.instance().initAndStart()` early in your app (for example in your app root) before performing authenticated operations.

## Login

Use the wrapper to login with credentials or token. The example app's `LoginScreen` demonstrates this:

```ts
// call to login
EnRouteWrapper.instance().loginWithCredentials(username, password);

// or
EnRouteWrapper.instance().loginWithToken(token, expires_in);
```

Listen for authentication events via the event bridge so you can update UI when login is needed, completed, or logged out. The example registers an event listener via `GlympseEnroute.onEnRouteEvent(...)` and inspects constants from `EnRouteEvents.getConstants()` to react accordingly.

## AppState handling — setActive

The SDK needs to know when the app is active or in background. Use React Native's `AppState` to call the SDK's `setActive` method. The example `App.tsx` shows this:

```ts
import { AppState } from 'react-native';

AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    EnRouteWrapper.instance().getEnRoute().setActive(true);
  }
  if (nextAppState === 'background') {
    EnRouteWrapper.instance().getEnRoute().setActive(false);
  }
});
```

Call `setActive(true)` when the app becomes active and `setActive(false)` when it goes to background.

## Listening for SDK Events

Subscribe to events emitted by the native module to respond to changes (login state, tasks changes, etc.). Example pattern:

```ts
import EnRouteEvents from '../../src/NativeEnRouteEvents';
import GlympseEnroute from '../../src/NativeGlympseEnroute';

const constants = EnRouteEvents.getConstants();

const subscription = GlympseEnroute.onEnRouteEvent((event) => {
  if (event.listener === constants.LISTENER_ENROUTE_MANAGER) {
    if ((event.events & constants.ENROUTE_MANAGER_SYNCED) !== 0) {
      // SDK synced — app can show tasks screen
    }
    if ((event.events & constants.ENROUTE_MANAGER_AUTHENTICATION_NEEDED) !== 0) {
      // show login UI or refresh the token
    }
  }
});

// When finished:
subscription.remove();
```

Similar listeners are used for tasks (`LISTENER_TASKS`). Use `EnRouteEvents.getConstants()` to find the listener and event constants you need.

## Requesting Permissions

The example includes a `PermissionService` helper that requests location and notification permissions for Android and iOS:

```ts
// example/src/PermissionService.tsx
import { Platform, PermissionsAndroid } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ]);
  } else {
    await PushNotificationIOS.requestPermissions({ alert: true, badge: true, sound: true });
    const whenInUseStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (whenInUseStatus === RESULTS.GRANTED) {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    }
  }
};
```

Call `requestPermissions()` early (for example on the first screen) so the SDK can track location and receive push notifications.

For iOS, if you're using react-native without Expo we recommend using [react-native-permissions](https://www.npmjs.com/package/react-native-permissions)

For Android, [PermissionsAndroid](https://reactnative.dev/docs/permissionsandroid)

Make sure your AndroidManifest.xml declares location permissions

```xml
<uses-permission android:name="android.permission.FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

## Push Notifications (iOS)

On iOS, the example registers the device token and forwards remote notification payloads to the SDK:

```ts
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotificationIOS.addEventListener('register', (token) => {
  EnRouteWrapper.instance().getEnRoute().registerDeviceToken(token);
});

PushNotificationIOS.addEventListener('notification', (notification) => {
  const data = notification.getData();
  const payload = data?.payload;
  if (payload) {
    EnRouteWrapper.instance().getEnRoute().handleRemoteNotification(payload);
  }
  notification.finish(PushNotificationIOS.FetchResult.NewData);
});
```

In your native iOS project, it's necessary to update AppDelegate to forward the device token and notifications when they are received. See the example app for a Swift example or find an Objective-c example here https://www.npmjs.com/package/@react-native-community/push-notification-ios 

- If using swift, you must import the header provided by @react-native-community/push-notification-ios

```c
#import <RNCPushNotificationIOS/RNCPushNotificationIOS.h>
```

- Your native project must declare Background Modes for `Location updates` and `Remote notifications`. It must also declare the `Push Notifications` capability.

To receive push notifications from Glympse, an APNS certificate must be generated for your app using App Store Connect and shared with Glympse.

## Push Notifications (Android) 

Android push flow is handled by the SDK and Firebase messaging. The only requirement is to provide Glympse with your application's package name so that a Firebase application ID can be generated for your app. This id will be placed in your AndroidManifest.xml file.

```xml
<meta-data android:name="glympse_fcm_application_id" android:value="[YOUR_ID_HERE]"/>
```

Also ensure your manifest contains a declaration for notifications
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

## Retrieving Objects (Tasks, Agent, Organization, Ticket)

Use the `getEnRoute()` instance to access managers and fetch objects. Examples:

```ts
// Tasks: get all tasks
const tasks = await EnRouteWrapper.instance().getEnRoute().taskManager.getTasks();

// Single task by id
const task = await EnRouteWrapper.instance().getEnRoute().taskManager.findTaskById(taskId);

// Agent (self)
const agent = await EnRouteWrapper.instance().getEnRoute().getSelfAgent();

// Organization
const org = await EnRouteWrapper.instance().getEnRoute().getOrganization();

// Full ticket with location arrays if track or route information is needed for rendering on a map
const fullTicket = await EnRouteWrapper.instance()
  .getEnRoute()
  .taskManager.getTicketWithFullLocationArray(taskId);
```

The example `TasksScreen` and `TaskDetailsScreen` demonstrate these calls and how to render results.

## Notes and best practices
- Initialize the SDK before performing authenticated operations.
- Keep a single wrapper instance for `EnRoute` to avoid multiple native instances. 
- The native EnRouteManager cannot be reused once it is stopped which will also happen after a logout or a login failure. EnRouteWrapper in the example shows how to check if it is started before calling login to ensure it's in the correct state.
- Always remove listeners when components unmount to avoid leaks.
- Request permissions proactively and explain why they are needed to users.

## License

MIT
