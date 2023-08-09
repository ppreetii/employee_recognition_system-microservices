import amqplib from "amqplib";

import { NewEmployeeListener } from "./services/auth/subscribers/new-employee-listener"; 

async function listenToRabbitMQ() {
  try {
    const rabbitmq = await amqplib.connect("amqp://localhost");
    console.log("Connected to RabbitMQ!");
    const listener = new NewEmployeeListener(rabbitmq);
    listener.subscribe()
  } catch (error) {
    console.log(error);
  }
}

listenToRabbitMQ();
