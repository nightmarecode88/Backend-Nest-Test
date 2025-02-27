import { Controller, Post, Body, HttpStatus, HttpException, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
