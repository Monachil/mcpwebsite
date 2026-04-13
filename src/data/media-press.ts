export interface PressItem {
  year: string;
  date: string;
  source: string;
  title: string;
  url: string;
}

import data from './media-press.json';
export const pressItems: PressItem[] = data;
