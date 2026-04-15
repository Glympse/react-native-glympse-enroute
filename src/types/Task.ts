import type Metadata from "./Metadata";
import type Operation from "./Operation";

export default interface Task {
    state: number;
    id: number;
    operation: Operation;
    description: string;
    agentId: number;
    dueTime: number;
    arrivedTime: number;
    completedTime: number;
    phase: string;
    foreignId: string;
    metadata: Metadata[];
    chatRoomId: string;
}
