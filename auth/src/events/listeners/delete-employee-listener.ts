import { Channel, Message } from "amqplib";
import {
  Listener,
  RoutingKeys,
  DeleteEmployeeEvent,
  ExchangeTypes,
  Exchange,
  NotFoundError,
  Queue,
} from "@reward-sys/common";

import { Auth } from "../../models/auth";

export class DeleteEmployeeListener extends Listener<DeleteEmployeeEvent> {
  readonly routingKey = RoutingKeys.DeleteEmployee;
  readonly queue = Queue.Auth;
  readonly exchange = Exchange.Auth;
  readonly exchangeType = ExchangeTypes.Direct;
  async onMessage(
    data: { email: string; employeeId: string },
    channel: Channel,
    msg: Message
  ): Promise<void> {
    try {
      const account = await Auth.findOne({
        email: data.email,
        employeeId: data.employeeId,
      });

      if (!account) {
        throw new NotFoundError();
      }

      if (account.is_active === 0) {
        return channel.ack(msg);
      }

      account.is_active = 0;

      await account.save();

      channel.ack(msg);

      console.log("Delete Employee Msg Processed!");
    } catch (error) {
      throw error;
    }
  }
}
