import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@hoffmanshf-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
