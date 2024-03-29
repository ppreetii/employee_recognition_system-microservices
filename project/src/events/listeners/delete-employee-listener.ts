import { Channel, Message } from "amqplib";
import {
  Listener,
  RoutingKeys,
  DeleteEmployeeEvent,
  ExchangeTypes,
  Exchange,
  Queue
} from "@reward-sys/rabbitmq";
import { NotFoundError } from "@reward-sys/common";

import { Employee } from "../../models/employee";

export class DeleteEmployeeListener extends Listener<DeleteEmployeeEvent> {
  readonly routingKey = RoutingKeys.DeleteEmployee;
  readonly queue = Queue.Project;
  readonly exchange = Exchange.Auth;
  readonly exchangeType = ExchangeTypes.Direct;
  async onMessage(
    data: { email: string; employeeId: string },
    channel: Channel,
    msg: Message
  ): Promise<void> {
    try {
      const employee = await Employee.findById(data.employeeId);

      if(!employee){
        throw new NotFoundError("Employee Not Found");
      }

      if(employee.is_active === 0){
        return channel.ack(msg);
      }

      employee.is_active = 0;
      
      await employee.save();

      channel.ack(msg);

      console.log("Delete Employee Msg Processed in Project Srv!")
    } catch (error) {
      throw error;
    }
  }
}
