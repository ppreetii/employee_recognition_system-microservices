import { ExchangeTypes } from "../rabbitmq/exhanges/exchange";

export interface Event {
  routingKey: string;
  queue: string;
  exchange: string;
  exchangeType: ExchangeTypes;
  message: any;
} 