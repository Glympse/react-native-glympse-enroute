import EnRoute from '@glympse-inc/react-native-glympse-enroute';
import GlympseEnroute from '../../src/NativeGlympseEnroute';

export default class EnRouteWrapper {
  static myInstance: EnRouteWrapper;

  _enroute: EnRoute;

  static instance() {
    if (!EnRouteWrapper.myInstance) {
      EnRouteWrapper.myInstance = new EnRouteWrapper();
    }
    return this.myInstance;
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

  loginWithToken(token: string, expires_in: number) {
    this._enroute.isStarted().then((started) => {
      if (!started) {
        this.initAndStart();
      }
      this._enroute.loginWithToken(token, expires_in);
    });
  }
}
