import { Connection, Channel } from 'amqplib';
export declare function connectRabbitMQ(): Promise<Connection>;
export declare function createChannel(connection: Connection): Promise<Channel>;
export declare function sendMessage(queue: string, message: any): Promise<void>;
export declare function receiveMessage(queue: string, handleMessage: (message: any) => any): Promise<void>;
