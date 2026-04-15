import GlympseEnroute, { type Spec as EnRouteSpec } from './NativeGlympseEnroute';
import TaskManager, { type Spec as TaskManagerSpec } from './NativeTaskManager';
import type Agent from './types/Agent';
import type Organization from './types/Organization';

export default class EnRoute {
  private enroute: EnRouteSpec;
  public taskManager: TaskManagerSpec;

  constructor() {
    this.enroute = GlympseEnroute;
    this.taskManager = TaskManager;
  }

  initModule() {
    this.enroute.initModule();
  }
  
  start() {
    this.enroute.start();
  }

  stop() {
    this.enroute.stop();
  }

  isStarted(): Promise<boolean> {
    return this.enroute.isStarted();
  }

  setActive(active: boolean) {
    this.enroute.setActive(active);
  }

  isLoginNeeded(): Promise<boolean> {
    return this.enroute.isLoginNeeded();
  }

  setAuthenticationMode(mode: number) {
    this.enroute.setAuthenticationMode(mode);
  }

  loginWithCredentials(username: string, password: string): Promise<boolean> {
    return this.enroute.loginWithCredentials(username, password);
  }

  loginWithToken(token: string, expires_in: number): Promise<boolean> {
    return this.enroute.loginWithToken(token, expires_in);
  }

  logout(reason: number) {
    this.enroute.logout(reason);
  }

  overrideLoggingLevel(level: number) {
    this.enroute.overrideLoggingLevel(level);
  }

  refresh() {
    this.enroute.refresh();
  }

  registerDeviceToken(token: string) {
    this.enroute.registerDeviceToken(token);
  }

  handleRemoteNotification(payload: string) {
    this.enroute.handleRemoteNotification(payload);
  }

  getOrganization(): Promise<Organization | null> {
    return this.enroute.getOrganization();
  }

  getSelfAgent(): Promise<Agent | null> {
    return this.enroute.getSelfAgent();
  }
}
