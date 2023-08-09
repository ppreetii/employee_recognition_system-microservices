import { RoutingKeys } from "../../../routing-keys";

export interface SignupEvent {
  routingKey: RoutingKeys.NewEmployeeCreated;
  queue: RoutingKeys.NewEmployeeCreated;
  message: {
    email: string;
  }
}
