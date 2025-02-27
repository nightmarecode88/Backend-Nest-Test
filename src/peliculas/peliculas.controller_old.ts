import { Controller, Post, Put, Delete, Body, Res, UseGuards } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importa JwtAuthGuard
import { AuthService } from '../auth/auth.service';

@Controller('peliculas')
export class PeliculasController {
  constructor(
    private peliculasService: PeliculasService,
    private authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('actualizar-swapi')
  async actualizarSWAPI(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario sea un administrador
    const userInfo = this.authService.decodeToken(body.token);
    if (userInfo.role !== 1 && userInfo.role !== 2) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    try {
      const films = await this.peliculasService.actualizarSWAPI();
      console.log(JSON.stringify(films, null, 2)); // Imprimir el array de películas en la consola
      res.status(200).json(films);
    } catch (error) {
      res.status(error.status ?? 500).json({ message: error.response ?? 'Error interno del servidor' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('crear_pelicula')
  async crearPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario sea un administrador
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
  @Put('editar_pelicula')
  async editarPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario sea un administrador
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
  @Delete('eliminar_pelicula')
  async eliminarPelicula(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario sea un administrador
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
  @Post('listado')
  async listado(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario esté autenticado
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
  @Post('detalle')
  async detalle(@Body() body, @Res() res: Response) {
    console.log('Body recibido:', body); // Agrega esta línea para imprimir el valor de body

    // Validar que el usuario sea regular
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