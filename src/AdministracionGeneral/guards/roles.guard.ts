import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const SERVICES_KEY = 'services';
export const Roles = (...servicios: number[]) => SetMetadata(SERVICES_KEY, servicios);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredServices = this.reflector.getAllAndOverride<number[]>(SERVICES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredServices) {
      return true; // La ruta no requiere roles específicos
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.servicios) {
      throw new ForbiddenException('No tienes permisos');
    }

    const hasService = user.servicios.some((servicio: number) => requiredServices.includes(servicio));
    if (!hasService) {
      throw new ForbiddenException('Acceso denegado por rol');
    }

    return true;
  }
}