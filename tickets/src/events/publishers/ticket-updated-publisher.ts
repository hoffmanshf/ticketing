import {
    Publisher,
    Subjects,
    TicketUpdatedEvent,
} from "@hoffmanshf-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
