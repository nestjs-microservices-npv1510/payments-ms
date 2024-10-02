// src/common/services/custom-client-proxy.service.ts

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

import * as config from '../../config';

@Injectable()
export class CustomClientProxyService implements OnModuleInit {
  // private client: ClientProxy;

  constructor(
    @Inject(config.NATS_SERVICE_NAME) private readonly client: ClientProxy, // Inject ClientProxy thay vì tự tạo
  ) {}

  onModuleInit() {
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.NATS,
    //   options: {
    //     // Cấu hình kết nối NATS của bạn ở đây
    //     url: 'nats://localhost:4222',
    //   },
    // });
  }

  /**
   * Gửi một message với metadata.
   * @param pattern Mẫu pattern của message.
   * @param data Dữ liệu payload chính.
   * @returns Observable<any>
   */
  send(pattern: string, data: any) {
    const messagePayload = {
      ...data,
      metadata: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    };
    return this.client.send(pattern, messagePayload);
  }

  /**
   * Gửi một event với metadata.
   * @param pattern Mẫu pattern của event.
   * @param data Dữ liệu payload chính.
   * @returns Observable<any>
   */
  emit(pattern: string, data: any) {
    const messagePayload = {
      ...data,
      metadata: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    };
    return this.client.emit(pattern, messagePayload);
  }
}
