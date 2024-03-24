import { Channel, Message } from "amqplib";

import {
  Listener,
  RoutingKeys,
  RewardEvent,
  ExchangeTypes,
  Exchange,
  Queue,
  Reward,
  rabbitmq,
} from "@reward-sys/rabbitmq";

import {
  getCurrDate,
  getEmpOfDay,
  getEmpOfMonth,
  getEmpOfWeek,
} from "../../services/reward";
import { DayEmpObj, MonthEmpObj, WeekEmpObj } from "../../types/reward";

import { WinnerEmployeePublisher } from "../publishers/winner-employee-publisher";

export class RewardEmployeeListener extends Listener<RewardEvent> {
  readonly routingKey = RoutingKeys.RewardedEmployee;
  readonly queue = Queue.Reward;
  readonly exchange = Exchange.Reward;
  readonly exchangeType = ExchangeTypes.Direct;
  protected retry: number = 0;

  async onMessage(data: { type: Reward }, channel: Channel, msg: Message) {
    try {
      const date = getCurrDate();
      let employee: DayEmpObj | WeekEmpObj | MonthEmpObj;
      if (data?.type === Reward.Day) {
        employee = await getEmpOfDay(date);
      } else if (data?.type === Reward.Week) {
        employee = await getEmpOfWeek(date);
      } else {
        employee = await getEmpOfMonth(date);
      }
      new WinnerEmployeePublisher(rabbitmq.client).publish(
        {
          type: data.type,
          data: employee,
        },
        [Queue.Reward]
      );
      channel.ack(msg);
      console.log(`Reward ${data.type} Msg Processed Successfully in Task Srv`);
    } catch (error: any) {
      throw error;
    }
  }
}
