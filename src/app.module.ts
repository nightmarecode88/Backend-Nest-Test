import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosRegularesModule } from './usuarios-regulares/usuarios-regulares.module';
import { PeliculasModule } from './peliculas/peliculas.module';

@Module({
  imports: [
    AuthModule,
    UsuariosRegularesModule,
    PeliculasModule, // Importa PeliculasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
