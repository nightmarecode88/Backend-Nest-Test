import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosRegularesService } from './usuarios-regulares.service';

describe('UsuariosRegularesService', () => {
  let service: UsuariosRegularesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosRegularesService],
    }).compile();

    service = module.get<UsuariosRegularesService>(UsuariosRegularesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
