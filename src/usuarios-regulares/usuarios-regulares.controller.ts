import { Controller, Post, Put, Delete, Get, Body, Param, Res, UseGuards } from '@nestjs/common';
import { UsuariosRegularesService } from './usuarios-regulares.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('usuarios-regulares')
@ApiBearerAuth()
@Controller('usuariosRegulares')
export class UsuariosRegularesController {
  constructor(private usuariosRegularesService: UsuariosRegularesService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['nombre', 'password', 'email'],
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Nombre o email en uso' })
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
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        delete: { type: 'string' },
        token: { type: 'string' }
      },
      required: ['delete', 'token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete('delete_user')
  async deleteUser(@Body() body, @Res() res: Response) {
    try {
      await this.usuariosRegularesService.deleteUser(body.delete);
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        updateData: { type: 'object' }
      },
      required: ['nombre', 'token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiOperation({ summary: 'Ver información del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      },
      required: ['token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Información del usuario obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Post('view_user')
  async viewUser(@Body() body, @Res() res: Response) {
    try {
      const user = await this.usuariosRegularesService.viewUser(body.token);
      res.status(200).json(user);
    } catch (error) {
      res.status(error.status).json({ message: error.response });
    }
  }

  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['nombre', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
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
