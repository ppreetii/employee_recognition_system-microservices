import { RoutingKeys } from "../../routing-keys";
import { ExchangeTypes } from "../../exhanges/exchange";

export interface DeleteEmployeeEvent {
  routingKey: RoutingKeys.DeleteEmployee;
  queue: RoutingKeys.DeleteEmployee;
  exchange: string;
  exchangeType: ExchangeTypes.Direct;
  message: {
    email: string;
    employeeId: string;
  };
}
