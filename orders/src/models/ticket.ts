import mongoose from "mongoose";
// import { OrderStatus } from "@hoffmanshf-ticketing/common";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
}

// properties used to create a ticket might be diff from properties end up on ticket
// e.g.g updated_at deleted_at
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// build function is used to enforce type check
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  // when transformed to JSON, replace _id with id
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// add build method to ticket model directly
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// add isReserved method to ticket document directly
// Notice: due to mongoose's restriction, you must use function() instead of anonymous function
ticketSchema.methods.isReserved = async function () {
  // 'this' refers to the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  // if existingOrder is null, !! will flip it to false
  // if existingOrder is not null, !! will flip it to true
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
