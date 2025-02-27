import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosRegularesController } from './usuarios-regulares.controller';

describe('UsuariosRegularesController', () => {
  let controller: UsuariosRegularesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosRegularesController],
    }).compile();

    controller = module.get<UsuariosRegularesController>(UsuariosRegularesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
