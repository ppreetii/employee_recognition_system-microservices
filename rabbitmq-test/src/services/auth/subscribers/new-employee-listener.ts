import { Channel , Message} from "amqplib";
import {Listener} from "../../../listener";

import { RoutingKeys } from "../../../routing-keys";
import { SignupEvent } from "../events/new-employee-event";

export class NewEmployeeListener extends Listener<SignupEvent> {
  readonly routingKey = RoutingKeys.NewEmployeeCreated;
  readonly queue = RoutingKeys.NewEmployeeCreated;
  async onMessage(data: { email: string }, channel: Channel, msg: Message): Promise<void> {
    try {
      //do something with data
      return new Promise((resolve)=>{
        setTimeout(()=>{
          console.log("Event Processed the data: ", data);
          channel.ack(msg);
          resolve();
        }, 2000)
      })
    } catch (error) {
      throw error
    }
  }
}