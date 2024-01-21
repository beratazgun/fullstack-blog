import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListsService } from './reading-lists.service';

describe('ReadingListsService', () => {
  let service: ReadingListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingListsService],
    }).compile();

    service = module.get<ReadingListsService>(ReadingListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
