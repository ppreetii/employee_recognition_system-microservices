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
exports.Listener = void 0;
class Listener {
    constructor(rabbitmq) {
        this.rabbitmq = rabbitmq;
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.rabbitmq.createChannel();
                yield channel.assertExchange(this.exchange, this.exchangeType, this.assertExchangeOptions);
                channel.assertQueue(this.queue, this.assertQueueOptions);
                channel.bindQueue(this.queue, this.exchange, this.routingKey);
                yield channel.consume(this.queue, (data) => __awaiter(this, void 0, void 0, function* () {
                    if (data) {
                        const content = this.parseMessage(data === null || data === void 0 ? void 0 : data.content);
                        console.log("Event Received on: ", this.routingKey, " with data: ", content);
                        this.onMessage(content, channel, data);
                    }
                }), {
                    noAck: false,
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    parseMessage(content) {
        return JSON.parse(content.toString());
    }
}
exports.Listener = Listener;
