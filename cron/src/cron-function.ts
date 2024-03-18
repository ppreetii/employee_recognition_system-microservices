import { rabbitmq, Queue, Reward } from "@reward-sys/rabbitmq";

import { RewardEmployeePublisher } from "./events/publishers/reward-employee-publisher";

export const findEmpOfDay = () => {
  new RewardEmployeePublisher(rabbitmq.client).publish(
    {
      type: Reward.Day,
    },
    [Queue.Reward]
  );
};

export const findEmpOfWeek = () => {
  new RewardEmployeePublisher(rabbitmq.client).publish(
    {
      type: Reward.Week,
    },
    [Queue.Reward]
  );
};

export const findEmpOfMonth = () => {
  new RewardEmployeePublisher(rabbitmq.client).publish(
    {
      type: Reward.Month,
    },
    [Queue.Reward]
  );
};
