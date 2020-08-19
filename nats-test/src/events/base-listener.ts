import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  // function to return when message is received
  abstract onMessage(data: any, msg: Message): void;
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
