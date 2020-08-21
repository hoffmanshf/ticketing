import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    // no need to include orderId in TicketCreatedEvent
    // since when ticket is just created it will not be reserved by any chance
  };
}
