import mongoose from "mongoose";
import {
  DeleteEmployeeEvent,
  Exchange,
  RoutingKeys,
  rabbitmq,
} from "@reward-sys/common";
import { Channel, Message } from "amqplib";

import { DeleteEmployeeListener } from "../../../src/events/listeners/delete-employee-listener";
import { Employee } from "../../../src/models/employee";
import { createEmployee } from "../../utils/project";

const setup = async () => {
  const listener = new DeleteEmployeeListener(rabbitmq.client);
    
  const {email, id} = await createEmployee();

  const data: DeleteEmployeeEvent["message"] = {
    email,
    employeeId: id
  };

  const channel: Channel = await rabbitmq.client.createChannel();
  const msg = {
    fields: {
      deliveryTag: 1,
      redelivered: false,
      exchange: Exchange.Employee,
      routingKey: RoutingKeys.NewEmployee,
    },
    properties: {
      contentType: "application/json",
    },
    content: Buffer.from(JSON.stringify(data)),
  } as Message;

  return { listener, data, channel, msg, email, id };
};

describe("Delete Employee Listener Test Cases", () => {
  it("Deletes Employee record in project service when employee is deleted", async () => {
    const { listener, data, channel, msg, email , id} = await setup();
    const publishSpy = jest.spyOn(DeleteEmployeeListener.prototype, "onMessage");

    await listener.onMessage(data, channel, msg);

    expect(publishSpy).toHaveBeenCalled();

    const employee = await Employee.findById(id);
    expect(employee!.is_active).toBe(0);

    publishSpy.mockReset();
    publishSpy.mockRestore();
  });

  it("Acks the message", async () => {
    const { listener, data, msg, channel } = await setup();
    await listener.onMessage(data, channel, msg);
    expect(channel.ack).toHaveBeenCalled();
  });
});
