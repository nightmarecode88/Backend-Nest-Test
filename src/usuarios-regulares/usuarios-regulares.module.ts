import { Module } from '@nestjs/common';
import { UsuariosRegularesService } from './usuarios-regulares.service';
import { UsuariosRegularesController } from './usuarios-regulares.controller';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [AuthModule], // Añade AuthModule a las importaciones
  providers: [UsuariosRegularesService],
  controllers: [UsuariosRegularesController]
})
export class UsuariosRegularesModule {}
