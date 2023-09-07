import mongoose from "mongoose";
import {
  DeleteEmployeeEvent,
  Exchange,
  Roles,
  RoutingKeys,
  rabbitmq,
} from "@reward-sys/common";
import { Channel, Message } from "amqplib";

import { DeleteEmployeeListener } from "../../../src/events/listeners/delete-employee-listener";
import { Auth } from "../../../src/models/auth";

const setup = async () => {
  const listener = new DeleteEmployeeListener(rabbitmq.client);
  const employeeId = new mongoose.Types.ObjectId();
  const email = "test@test.com";
  const account = Auth.build({
    email,
    password: "1234567890",
    role: Roles.Employee,
    employeeId,
  });

  await account.save();

  const accountId = account.id;
  const data: DeleteEmployeeEvent["message"] = {
    email,
    employeeId: employeeId.toHexString(),
  };

  const channel: Channel = await rabbitmq.client.createChannel();
  const msg = {
    fields: {
      deliveryTag: 1,
      redelivered: false,
      exchange: Exchange.Employee,
      routingKey: RoutingKeys.DeleteEmployee,
    },
    properties: {
      contentType: "application/json",
    },
    content: Buffer.from(JSON.stringify(data)),
  } as Message;

  return { listener, account, data, employeeId, accountId, channel, msg };
};

describe("Delete Employee Listener Test Cases", () => {
  it("Sets is_active of account record to 0 when employee is deleted", async () => {
    const { listener, accountId, data, channel, msg } = await setup();
    const publishSpy = jest.spyOn(
      DeleteEmployeeListener.prototype,
      "onMessage"
    );

    await listener.onMessage(data, channel, msg);

    expect(publishSpy).toHaveBeenCalled();

    const updatedAccount = await Auth.findById(accountId);
    expect(updatedAccount!.is_active).toBe(0);

    publishSpy.mockReset();
    publishSpy.mockRestore();
  });

  it("Acks the message", async () => {
    const { listener, data, msg, channel } = await setup();
    await listener.onMessage(data, channel, msg);
    expect(channel.ack).toHaveBeenCalled();
  });
});
