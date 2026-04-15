import EnRouteWrapper from './EnRouteWrapper';
import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  type EventSubscription,
} from 'react-native';
import EnRouteEvents from '../../src/NativeEnRouteEvents';
import GlympseEnroute from '../../src/NativeGlympseEnroute';

const LoginScreen = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const listenerSubscription = useRef<null | EventSubscription>(null);

  useEffect(() => {
    const { LISTENER_ENROUTE_MANAGER, ENROUTE_MANAGER_LOGGED_OUT } =
      EnRouteEvents.getConstants();

    listenerSubscription.current = GlympseEnroute.onEnRouteEvent(
      (glympseEvent) => {
        console.log('event in LoginScreen', glympseEvent);
        if (glympseEvent.listener === LISTENER_ENROUTE_MANAGER) {
          if ((glympseEvent.events & ENROUTE_MANAGER_LOGGED_OUT) !== 0) {
            setLoginError('Invalid username or password');
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    };
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    EnRouteWrapper.instance().loginWithCredentials(username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EnRoute React Native</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setUsername(text);
            setLoginError('');
          }}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setPassword(text);
            setLoginError('');
          }}
        />
      </View>

      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>LOGIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#0070E0',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#0070E0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D8000C',
    backgroundColor: '#FFBABA',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: '600',
    width: '80%',
    textAlign: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
});

export default LoginScreen;
