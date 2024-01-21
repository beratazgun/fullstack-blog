import { Module } from '@nestjs/common';
import { ReadingListsService } from './reading-lists.service';
import { ReadingListsController } from './reading-lists.controller';

@Module({
  providers: [ReadingListsService],
  controllers: [ReadingListsController],
})
export class ReadingListsModule {}
