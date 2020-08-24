import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  // ? tells ts this field might be undefined
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      // this._client!.on("connect", () => {
      //   console.log("Connected to NATS");
      //   resolve();
      // });
      // this._client!.on("error", (err) => {
      //   reject(err);
      // });
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

// singleton pattern
// we only have one instance of this class since we exported the instance here
// then we can connect to NATS in index.ts and access the client from other files
export const natsWrapper = new NatsWrapper();
