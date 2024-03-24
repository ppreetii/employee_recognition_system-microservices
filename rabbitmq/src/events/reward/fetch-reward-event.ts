import { RoutingKeys } from "../../routing-keys";
import { ExchangeTypes } from "../../exhanges/exchange";
import { Reward } from "../../types/reward-type";

export interface RewardEvent {
  routingKey: RoutingKeys.RewardedEmployee;
  queue: RoutingKeys.RewardedEmployee;
  exchange: string;
  exchangeType: ExchangeTypes;
  message: {
    type: Reward;
  };
}
