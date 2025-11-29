import type { Profile } from '@/types/profile';
import { atom } from 'jotai';

export const likedProfilesState = atom<Profile[]>([]);
