import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListsController } from './reading-lists.controller';

describe('ReadingListsController', () => {
  let controller: ReadingListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingListsController],
    }).compile();

    controller = module.get<ReadingListsController>(ReadingListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
