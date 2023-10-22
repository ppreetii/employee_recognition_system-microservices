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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitmq = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = __importDefault(require("./configs/config"));
class RabbitMQ {
    get client() {
        if (!this._client) {
            throw new Error("Cannot Access RabbitMQ before connecting");
        }
        return this._client;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._client = yield amqplib_1.default.connect(config_1.default.rabbitmqUrl);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.rabbitmq = new RabbitMQ();
