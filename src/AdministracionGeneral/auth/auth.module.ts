import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {AuthGuard} from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
    imports: [
        JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
    ],
    controllers: [AuthController],
    providers: [AuthService, {provide: 'APP_GUARD', useClass: AuthGuard},{ provide: 'APP_GUARD', useClass: RolesGuard },],
})
export class AuthModule {}
