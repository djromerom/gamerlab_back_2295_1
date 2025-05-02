import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('Prisma Client Connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client Disconnected');
  }

}