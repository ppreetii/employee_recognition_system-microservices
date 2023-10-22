import { Channel, Message } from "amqplib";
import mongoose from "mongoose";
import {
  Listener,
  RoutingKeys,
  NewEmployeeEvent,
  ExchangeTypes,
  Exchange,
  Queue
} from "@reward-sys/rabbitmq";

import { Employee } from "../../models/employee";

export class NewEmployeeListener extends Listener<NewEmployeeEvent> {
  readonly routingKey = RoutingKeys.NewEmployee;
  readonly queue = Queue.Employee;
  readonly exchange = Exchange.Employee;
  readonly exchangeType = ExchangeTypes.Direct;
  async onMessage(
    data: { email: string; employeeId: mongoose.Types.ObjectId },
    channel: Channel,
    msg: Message
  ): Promise<void> {
    try {
      const exists = await Employee.findById(data.employeeId);
      if(exists){
        return channel.ack(msg);
      }
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
