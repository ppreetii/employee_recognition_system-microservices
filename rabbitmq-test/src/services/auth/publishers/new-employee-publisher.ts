import { Publisher } from "../../../publisher";

import { SignupEvent } from "../events/new-employee-event";
import { RoutingKeys } from "../../../routing-keys";

export class NewEmployeePublisher extends Publisher<SignupEvent> {
  readonly routingKey = RoutingKeys.NewEmployeeCreated;
  readonly queue = RoutingKeys.NewEmployeeCreated;
}
