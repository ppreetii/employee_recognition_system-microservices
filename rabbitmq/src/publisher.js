"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(rabbitmq) {
        this.rabbitmq = rabbitmq;
    }
    publish(data, queues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.rabbitmq.createChannel();
                yield channel.assertExchange(this.exchange, this.exchangeType, this.assertExchangeOptions);
                queues.forEach(queue => {
                    channel.assertQueue(queue, this.assertQueueOptions);
                });
                channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), this.publishOptions);
                console.log("Event Published to: ", this.routingKey, " with data: ", JSON.stringify(data));
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Publisher = Publisher;
