import { Channel, Message } from "amqplib";
import mongoose from "mongoose";
import {
  Listener,
  RoutingKeys,
  NewEmployeeEvent,
  ExchangeTypes,
  Exchange,
  Queue,
} from "@reward-sys/rabbitmq";

import Employee from "../../db/models/employee";

export class NewEmployeeListener extends Listener<NewEmployeeEvent> {
  readonly routingKey = RoutingKeys.NewEmployee;
  readonly queue = Queue.Task;
  readonly exchange = Exchange.Task;
  readonly exchangeType = ExchangeTypes.Direct;
  protected retry: number = 0;

  async onMessage(
    data: {
      email: string;
      employeeId: mongoose.Types.ObjectId;
      name?: string | undefined;
      designation?: string | undefined;
      projectId?: string[] | undefined;
    },
    channel: Channel,
    msg: Message
  ){
    try {
      if (!data.designation) {
        //we don't save data when auth publish the message, it is meant for only employee service
        return channel.ack(msg);
      }
      const employee = new Employee({
        id: data.employeeId.toString(),
        email: data.email,
        name: data.name!,
        designation: data.designation!,
        projectId: data.projectId!
      });

      await employee.save();

      channel.ack(msg);
      console.log("New Employee Msg Processed Successfully in Task Srv");
    } catch (error: any) {
      throw error;
    }
  }
}
