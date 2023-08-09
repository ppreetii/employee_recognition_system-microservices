export const EXCHANGE = "reward-rabbitmq-exchange";

export enum ExchangeTypes {
  Direct = "direct",
  Fanout = "fanout",
  Topic = "topic",
  Headers = "headers",
}