import { Controller, Post, Put, Delete, Body, Res, UseGuards } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('peliculas')
@ApiBearerAuth()
@Controller('peliculas')
export class PeliculasController {
  constructor(
    private peliculasService: PeliculasService,
    private authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar películas desde SWAPI' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Películas actualizadas correctamente' })
  @Post('actualizar-swapi')
  async actualizarSWAPI(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 1 && userInfo.role !== 2) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const films = await this.peliculasService.actualizarSWAPI();
      console.log(JSON.stringify(films, null, 2));
      res.status(200).json(films);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear una nueva película' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        title: { type: 'string' },
        opening_crawl: { type: 'string', nullable: true },
        director: { type: 'string', nullable: true },
        producer: { type: 'string', nullable: true },
        release_date: { type: 'string', nullable: true },
        status: { type: 'number', nullable: true },
      },
      required: ['token', 'title'],
    },
  })
  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  @Post('crear_pelicula')
  async crearPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 1 && userInfo.role !== 2) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const newFilm = await this.peliculasService.crearPelicula(body);
      res.status(201).json(newFilm);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Editar una película existente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        title: { type: 'string' },
        opening_crawl: { type: 'string', nullable: true },
        director: { type: 'string', nullable: true },
        producer: { type: 'string', nullable: true },
        release_date: { type: 'string', nullable: true },
        status: { type: 'number', nullable: true },
      },
      required: ['token', 'title'],
    },
  })
  @ApiResponse({ status: 200, description: 'Película editada exitosamente' })
  @Put('editar_pelicula')
  async editarPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 1 && userInfo.role !== 2) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const updatedFilm = await this.peliculasService.editarPelicula(body.title, body);
      res.status(200).json(updatedFilm);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar una película existente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        title: { type: 'string' },
      },
      required: ['token', 'title'],
    },
  })
  @ApiResponse({ status: 200, description: 'Película eliminada exitosamente' })
  @Delete('eliminar_pelicula')
  async eliminarPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 1 && userInfo.role !== 2) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      await this.peliculasService.eliminarPelicula(body.title);
      res.status(200).json({ message: 'Película eliminada' });
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener el listado de películas' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Listado de películas obtenido exitosamente' })
  @Post('listado')
  async listado(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (!userInfo) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const peliculas = await this.peliculasService.listadoPeliculas();
      res.status(200).json(peliculas);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener detalles de una película' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        token: { type: 'string' },
        title: { type: 'string' },
      },
      required: ['token', 'title'],
    },
  })
  @ApiResponse({ status: 200, description: 'Detalles de la película obtenidos exitosamente' })
  @Post('detalle')
  async detalle(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body);

    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 0) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const pelicula = await this.peliculasService.detallePelicula(body.title);
      res.status(200).json(pelicula);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }
}
