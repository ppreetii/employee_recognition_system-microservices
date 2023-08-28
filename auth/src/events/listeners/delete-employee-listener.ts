import { Channel, Message } from "amqplib";
import mongoose from "mongoose";
import {
  Listener,
  RoutingKeys,
  DeleteEmployeeEvent,
  ExchangeTypes,
  Exchange,
  NotFoundError
} from "@reward-sys/common";

import { Auth } from "../../models/auth";

export class DeleteEmployeeListener extends Listener<DeleteEmployeeEvent> {
  readonly routingKey = RoutingKeys.DeleteEmployee;
  readonly queue = RoutingKeys.DeleteEmployee;
  readonly exchange = Exchange.Employee;
  readonly exchangeType = ExchangeTypes.Direct;
  async onMessage(
    data: { email: string; employeeId: string },
    channel: Channel,
    msg: Message
  ): Promise<void> {
    try {
      const account = await Auth.findOne({
        email: data.email,
        employeeId: data.employeeId
      });

      if(!account){
        throw new NotFoundError();
      }

      account.is_active = 0;
      
      await account.save();

      channel.ack(msg);

      console.log("Delete Employee Msg Processed!")
    } catch (error) {
      throw error;
    }
  }
}
