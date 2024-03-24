import { RoutingKeys } from "../../routing-keys";
import { ExchangeTypes } from "../../exhanges/exchange";
import { Reward } from "../../types/reward-type";

export interface WinnerEvent {
  routingKey: RoutingKeys.WinnerEmployee;
  queue: RoutingKeys.WinnerEmployee;
  exchange: string;
  exchangeType: ExchangeTypes;
  message: {
    type: Reward;
    data: any; 
  };
}
