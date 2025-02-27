import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [HttpModule, AuthModule], // Añade HttpModule y AuthModule a las importaciones
  providers: [PeliculasService],
  controllers: [PeliculasController]
})
export class PeliculasModule {}
