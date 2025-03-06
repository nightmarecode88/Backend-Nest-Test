import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosRegularesController } from './usuarios-regulares.controller';
import { UsuariosRegularesService } from './usuarios-regulares.service';
import { AuthModule } from '../auth/auth.module'; // Importar el módulo de autenticación
import { PeliculasModule } from '../peliculas/peliculas.module'; // Importar el módulo de películas
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('UsuariosRegularesController', () => {
  let app: INestApplication;
  let tokenBearer: string; // Variable para guardar el token Bearer
  let token: string; // Variable para guardar el token
  let objSend={'nombre':'','token':''};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, PeliculasModule], // Importar el módulo de autenticación
      controllers: [UsuariosRegularesController],
      providers: [UsuariosRegularesService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería crear un usuario regular', async () => {
    const userDto = { nombre: 'test123', email: 'test123@email.com', password: '123456' };
    await request(app.getHttpServer())
      .post('/usuariosRegulares/new_user')
      .send(userDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.nombre).toBe(userDto.nombre);
        expect(res.body.email).toBe(userDto.email);
        CReport(res.body);
      });
  });

  it('debería iniciar sesión y devolver un token Bearer', async () => {
    const loginDto = { nombre: 'test123', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/usuariosRegulares/login_user')
      .send(loginDto)
      .expect(200);

    tokenBearer = `Bearer ${response.body.token}`;//Bearer
    token = response.body.token;

    console.log('parametro token:', token);
    CReport(response.body);
  });

  it('deberíamos obtener el listado de películas usando el token Bearer y el nombre de usuario', async () => {
    objSend.nombre='test123';
    objSend.token=token;
    console.log('2parametro objSend:', objSend);

    await request(app.getHttpServer())
      .post('/peliculas/listado') // Ajusta la ruta según tu API
      .set('Authorization', tokenBearer)
      .send(objSend) // Enviar el nombre en el cuerpo
      .expect(200)
      .expect((res) => {
        console.log('Listado de películas:', res.body);
        expect(res.body).toBeInstanceOf(Array);
        console.log('parametro token:', token);
        CReport(res.body);
      });
  });
});

// Implementación de ejemplo de la función CReport
function CReport(response) {
  if (!response || response.status >= 400) {
    throw new Error('Test failed');
  }
  console.log('Test passed:', response);
}
