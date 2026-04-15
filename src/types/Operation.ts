import type Ticket from "./Ticket";

export default interface Operation {
    state: number;
    id: number;
    startTime: number;
    ticketId: string;
    ticket: Ticket;
}
