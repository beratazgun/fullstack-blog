import { IBlog } from "./IBlog";

export interface IReadingList extends Pick<IBlog, "blogCode"> {
  readingListName: string;
  readingListCode: string;
  readingListSlug: string;
}
