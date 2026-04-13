export interface MediaVideo {
  year: string;
  date: string;
  title: string;
  description: string;
  source: string;
  image: string;
  imageAlt: string;
  url: string;
  localVideo?: string;
  external?: boolean;
}

import data from './media-videos.json';
export const mediaVideos: MediaVideo[] = data;
