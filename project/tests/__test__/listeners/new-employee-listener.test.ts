import mongoose from "mongoose";
import {
  NewEmployeeEvent,
  Exchange,
  RoutingKeys,
  rabbitmq,
} from "@reward-sys/common";
import { Channel, Message } from "amqplib";

import { NewEmployeeListener } from "../../../src/events/listeners/new-employee-listener";
import { Employee } from "../../../src/models/employee";

const setup = async () => {
  const listener = new NewEmployeeListener(rabbitmq.client);
  const employeeId = new mongoose.Types.ObjectId();
  const email = "test@test.com";
  const name = "Test Employee"

  const data: NewEmployeeEvent["message"] = {
    email,
    employeeId,
    name
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

  return { listener, data, employeeId, channel, msg, email, name };
};

describe("New Employee Listener Test Cases", () => {
  it("Replicates Employee record in project service when employee is created", async () => {
    const { listener, data, channel, msg, employeeId, email , name} = await setup();
    const publishSpy = jest.spyOn(NewEmployeeListener.prototype, "onMessage");

    await listener.onMessage(data, channel, msg);

    expect(publishSpy).toHaveBeenCalled();

    const employee = await Employee.findById(employeeId);
    expect(employee!.email).toBe(email);
    expect(employee!.name).toBe(name);

    publishSpy.mockReset();
    publishSpy.mockRestore();
  });

  it("Acks the message", async () => {
    const { listener, data, msg, channel } = await setup();
    await listener.onMessage(data, channel, msg);
    expect(channel.ack).toHaveBeenCalled();
  });
});
