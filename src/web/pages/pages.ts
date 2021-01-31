import { Content } from '../control/contentControl';
import { author } from './author';
import { recentComments } from './recentComments';
import { recentMentions } from './recentMentions';
import { visitCount } from './visitCount';
import { wtcupVote } from './wtcupVote';

export interface Page {
  name: string;
  handler: (content: Content, path: string) => boolean;
}

export const pages: Array<Page> = [
  recentComments,
  visitCount,
  recentMentions,
  author,
  wtcupVote,
];
