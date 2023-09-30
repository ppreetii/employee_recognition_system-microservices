import mongoose from "mongoose";

import { RoutingKeys } from "../../routing-keys";
import { ExchangeTypes } from "../../exhanges/exchange";

export interface DeleteEmployeeEvent {
  routingKey: RoutingKeys.DeleteEmployee;
  queue: RoutingKeys.DeleteEmployee;
  exchange: string;
  exchangeType: ExchangeTypes;
  message: {
    email: string;
    employeeId: string;
  };
}
