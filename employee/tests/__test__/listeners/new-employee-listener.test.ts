import mongoose from "mongoose";
import {
  NewEmployeeEvent,
  Exchange,
  RoutingKeys,
  rabbitmq,
} from "@reward-sys/rabbitmq";
import { Channel, Message } from "amqplib";

import { NewEmployeeListener } from "../../../src/events/listeners/new-employee-listener";
import { Employee } from "../../../src/models/employee";

const setup = async () => {
  const listener = new NewEmployeeListener(rabbitmq.client);
  const employeeId = new mongoose.Types.ObjectId();
  const email = "test@test.com";

  const data: NewEmployeeEvent["message"] = {
    email,
    employeeId,
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

  return { listener, data, employeeId, channel, msg, email };
};

describe("New Employee Listener Test Cases", () => {
  it("Creates Employee record when account is created for employee", async () => {
    const { listener, data, channel, msg, employeeId, email } = await setup();
    const publishSpy = jest.spyOn(NewEmployeeListener.prototype, "onMessage");

    await listener.onMessage(data, channel, msg);

    expect(publishSpy).toHaveBeenCalled();

    const employee = await Employee.findById(employeeId);
    expect(employee!.email).toBe(email);

    publishSpy.mockReset();
    publishSpy.mockRestore();
  });

  it("Acks the message", async () => {
    const { listener, data, msg, channel } = await setup();
    await listener.onMessage(data, channel, msg);
    expect(channel.ack).toHaveBeenCalled();
  });
});
