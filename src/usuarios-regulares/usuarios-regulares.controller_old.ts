import { Controller, Post, Put, Delete, Get, Body, Param, Res, UseGuards } from '@nestjs/common';
import { UsuariosRegularesService } from './usuarios-regulares.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Asegúrate de tener un guard para JWT

@Controller('usuariosRegulares')
export class UsuariosRegularesController {
  constructor(private usuariosRegularesService: UsuariosRegularesService) {}

  @Post('new_user')
  async createUser(@Body() body, @Res() res: Response) {
    try {
      const user = await this.usuariosRegularesService.createUser(body);
      res.status(201).json(user);
    } catch (error) {
      res.status(error.status).json({ message: error.response });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete_user')
  async deleteUser(@Body() body, @Res() res: Response) {
    try {
      await this.usuariosRegularesService.deleteUser(body.delete);
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('modify_user')
  async updateUser(@Body() body, @Res() res: Response) {
    try {
      const { nombre, ...updateData } = body;
      await this.usuariosRegularesService.updateUser(nombre, updateData);
      res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
      res.status(error.status).json({ message: error.response });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('view_user')
  async viewUser(@Body() body, @Res() res: Response) {
    try {
      const user = await this.usuariosRegularesService.viewUser(body.token);
      res.status(200).json(user);
    } catch (error) {
      res.status(error.status).json({ message: error.response });
    }
  }

  @Post('login_user')
  async loginUser(@Body() body, @Res() res: Response) {
    try {
      const token = await this.usuariosRegularesService.loginUser(body);
      res.status(200).json(token);
    } catch (error) {
      res.status(error.status).json({ message: error.response });
    }
  }
}
