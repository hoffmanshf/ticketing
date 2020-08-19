import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

// interface FakeData {
//   name: string;
//   price: number;
// }
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = "payments-service";
  // it's equivalent to final in Java
  readonly subject = Subjects.TicketCreated;

  // why do we need this enforcing type checking?
  // in this case, ts will throw error
  // onMessage(data: FakeData, msg: Message): void {
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data", data);
    msg.ack();
  }
}
