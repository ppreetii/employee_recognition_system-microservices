import amqplib from "amqplib";

import { NewEmployeePublisher } from "./services/auth/publishers/new-employee-publisher";

async function publishToRabbitMQ(){
    try {
        const rabbitmq = await amqplib.connect("amqp://localhost");
        console.log("Connected to RabbitMQ!");
        const publisher = new NewEmployeePublisher(rabbitmq);
        await publisher.publish({
          email: "test@test.com"
        });

    } catch (error) {
        console.log(error);
    }
}

publishToRabbitMQ();
