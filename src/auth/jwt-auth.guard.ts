import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }
  }
}
