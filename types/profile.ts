export interface Profile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  distance: number;
  location: string;
  images: string[];
  verified?: boolean;
  interests?: string[];
}

import sampleData from '../sample-data.json';

export const mockProfiles: Profile[] = sampleData;
