import { Test, TestingModule } from '@nestjs/testing';
import { VideojuegosController } from './videojuegos.controller';
import { VideojuegosService } from './videojuegos.service';

describe('VideojuegosController', () => {
  let controller: VideojuegosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideojuegosController],
      providers: [VideojuegosService],
    }).compile();

    controller = module.get<VideojuegosController>(VideojuegosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
