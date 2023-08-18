import { Channel, Message } from "amqplib";
import mongoose from "mongoose";
import {
  Listener,
  RoutingKeys,
  NewEmployeeEvent,
  ExchangeTypes,
  Exchange
} from "@reward-sys/common";

import { Employee } from "../../models/employee";

export class NewEmployeeListener extends Listener<NewEmployeeEvent> {
  readonly routingKey = RoutingKeys.NewEmployee;
  readonly queue = RoutingKeys.NewEmployee;
  readonly exchange = Exchange.Employee;
  readonly exchangeType = ExchangeTypes.Direct;
  async onMessage(
    data: { email: string; employeeId: mongoose.Types.ObjectId },
    channel: Channel,
    msg: Message
  ): Promise<void> {
    try {
      const employee = Employee.build({
        id: data.employeeId,
        email: data.email,
      });

      await employee.save();

      channel.ack(msg);
    } catch (error) {
      throw error;
    }
  }
}
