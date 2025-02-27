import { Controller, Post, Body, HttpStatus, HttpException, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(@Body() req, @Res() res: Response) {
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return res.status(HttpStatus.OK).json({
      status: 'success ok',
      token: await this.authService.login(user),
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo administrador' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        newAdmin: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        cambiarPass: { type: 'boolean' }
      },
      required: ['token', 'newAdmin', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Administrador creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Post('create-admin')
  async createAdmin(@Body() body, @Res() res: Response) {
    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 2) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Acceso denegado' });
    }

    try {
      const newAdmin = await this.authService.createAdmin(body);
      res.status(HttpStatus.CREATED).json(newAdmin);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }
}
