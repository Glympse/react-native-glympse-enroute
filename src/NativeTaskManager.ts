import { TurboModuleRegistry, type TurboModule } from 'react-native';
import type Task from './types/Task';
import type Ticket from './types/Ticket';

export interface Spec extends TurboModule {
    refresh(): void;
    getTasks(): Promise<Task[]>;
    findTaskById(taskId: number): Promise<Task | null>;
    startTask(taskId: number): Promise<boolean>;
    setTaskPhase(taskId: number, phase: string): Promise<boolean>;
    completeTask(taskId: number): Promise<boolean>;
    setTravelMode(taskId: number, mode: string): void;
    getTravelMode(taskId: number): Promise<string>;
    addOrUpdateMetadata(taskId: number, key: string, value: string): void;
    getTicketWithFullLocationArray(taskId: number): Promise<Ticket | null>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TaskManager');
