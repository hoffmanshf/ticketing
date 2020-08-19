import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// when we instantiate the Listener, we need to provide some custom type in <>
export abstract class Listener<T extends Event> {
  // abstract subject: string;
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  // function to return when message is received
  // abstract onMessage(data: any, msg: Message): void;
  abstract onMessage(data: T["data"], msg: Message): void;

  private client: Stan;
  // default wait time is 5 seconds
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  // by setting manualAckMode to true,
  // node-nats-streaming will not automatically tell the streaming service event is acknowledged
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
}
