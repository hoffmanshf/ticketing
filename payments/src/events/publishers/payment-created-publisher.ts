import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@hoffmanshf-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
