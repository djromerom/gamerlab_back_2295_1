import { Module } from '@nestjs/common';
import { AuthModule } from './AdministracionGeneral/auth/auth.module';
import { AdminModule } from './AdministracionGeneral/Admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule,AuthModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
