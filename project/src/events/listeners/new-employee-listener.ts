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
  readonly queue = Queue.Project;
  readonly exchange = Exchange.Project;
  readonly exchangeType = ExchangeTypes.Direct;
  protected retry: number = 0;
  async onMessage(data: { email: string; employeeId: mongoose.Types.ObjectId; name?: string | undefined; }, channel: Channel, msg: Message): Promise<void> {
    try {
      if(!data.name){
        return channel.ack(msg);
      }
      const employee = Employee.build({
        id: data.employeeId,
        email: data.email,
        name: data.name!
      });

      await employee.save();

      channel.ack(msg);
      console.log("New Employee Msg Processed successfully")
    } catch (error: any) {
      throw error;
    }
  }
}
