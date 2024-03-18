import cron from "node-cron";
import { rabbitmq } from "@reward-sys/rabbitmq";

import { cronTasks } from "./cron-task";
import { CronTask } from "./types/cron";
import config from "./configs/config";

async function startServer() {
  try {
    await rabbitmq.connect(config.rabbitmqUrl);
    console.log("Connected to RabbitMQ");

    cronTasks.forEach((cronTask: CronTask) => {
      cron.schedule(cronTask.schedule, cronTask.runFunc, {
        scheduled: true,
        timezone: "Asia/Kolkata",
        name: cronTask.name,
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

startServer();