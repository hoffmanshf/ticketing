import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@hoffmanshf-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
