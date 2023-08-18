import mongoose from "mongoose";

import { RoutingKeys } from "../../routing-keys";
import { ExchangeTypes } from "../../exhanges/exchange";

export interface NewEmployeeEvent {
  routingKey: RoutingKeys.NewEmployee;
  queue: RoutingKeys.NewEmployee;
  exchange: string;
  exchangeType: ExchangeTypes.Direct;
  message: {
    email: string;
    employeeId: mongoose.Types.ObjectId;
  };
}
