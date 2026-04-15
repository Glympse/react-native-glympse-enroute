import { Platform, PermissionsAndroid } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.POST_NOTIFICATIONS'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('All permissions granted');
      } else {
        console.log('One or more permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    await PushNotificationIOS.requestPermissions({alert: true, badge: true, sound: true}).then((data) => {
      console.log('iOS notification permissions granted:', data);
    }).catch((err) => {
      console.warn(err);
    });

    const whenInUseStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (whenInUseStatus === RESULTS.GRANTED) {
      const alwaysStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (alwaysStatus === RESULTS.GRANTED) {
        console.log('Location permissions granted: Always');
      } else {
        console.log('Location permissions granted: When In Use');
      }
    } else {
      console.log('Location permission denied');
    }
  }
};
