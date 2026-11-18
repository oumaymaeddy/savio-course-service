import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  // Fake answer: what the real service would return
  const health = {
    status: 'ok',
    databaseTime: new Date('2026-11-18T20:00:00Z'),
  };

  // The "stunt double" for AppService
  const appServiceMock = { getHello: jest.fn().mockResolvedValue(health) };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    appController = app.get(AppController);
  });

  describe('GET /', () => {
    it('returns the health status from AppService', async () => {
      await expect(appController.getHello()).resolves.toEqual(health);
      expect(appServiceMock.getHello).toHaveBeenCalledTimes(1);
    });
  });
});
